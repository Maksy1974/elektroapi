const prisma = require("../lib/prisma");

const CAMPUS_LAT = Number(process.env.CAMPUS_LAT ?? 1.4517);
const CAMPUS_LNG = Number(process.env.CAMPUS_LNG ?? 124.8424);
const MAX_DISTANCE_METER = Number(process.env.ABSEN_RADIUS_METER ?? 500);

function toRad(value) {
  return (value * Math.PI) / 180;
}

function haversineDistanceMeter(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function parseCoordinate(raw) {
  const value = Number(raw);
  return Number.isFinite(value) ? value : NaN;
}

exports.create = async (req, res, next) => {
  try {
    const tendikId = Number(req.params.id);
    const latitude = parseCoordinate(req.body.latitude);
    const longitude = parseCoordinate(req.body.longitude);

    if (!Number.isInteger(tendikId)) {
      return res.status(400).json({ message: "tendikId tidak valid" });
    }
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({ message: "latitude dan longitude wajib berupa angka valid" });
    }

    const tendik = await prisma.tendik.findUnique({ where: { id: tendikId } });
    if (!tendik) return res.status(404).json({ message: "Tendik tidak ditemukan" });

    const jarakMeter = haversineDistanceMeter(latitude, longitude, CAMPUS_LAT, CAMPUS_LNG);
    if (jarakMeter > MAX_DISTANCE_METER) {
      return res.status(403).json({
        message: "Absen ditolak: Anda berada di luar area kampus",
        jarakMeter,
        batasMeter: MAX_DISTANCE_METER,
      });
    }

    const data = await prisma.absenTendik.create({
      data: {
        tendikId,
        latitude,
        longitude,
        jarakMeter,
      },
    });

    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.getByTendik = async (req, res, next) => {
  try {
    const tendikId = Number(req.params.id);
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const where = { tendikId };
    if (startDate || endDate) {
      where.diambilPada = {};
      if (startDate) where.diambilPada.gte = startDate;
      if (endDate) where.diambilPada.lte = endDate;
    }

    const data = await prisma.absenTendik.findMany({
      where,
      orderBy: { diambilPada: "desc" },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.report = async (req, res, next) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const tendikId = req.query.tendikId ? Number(req.query.tendikId) : null;

    const where = {};
    if (Number.isInteger(tendikId)) where.tendikId = tendikId;
    if (startDate || endDate) {
      where.diambilPada = {};
      if (startDate) where.diambilPada.gte = startDate;
      if (endDate) where.diambilPada.lte = endDate;
    }

    const detail = await prisma.absenTendik.findMany({
      where,
      include: { tendik: true },
      orderBy: { diambilPada: "desc" },
    });

    const grouped = new Map();
    for (const row of detail) {
      const key = row.tendikId;
      if (!grouped.has(key)) {
        grouped.set(key, {
          tendikId: row.tendikId,
          nip: row.tendik.nip,
          namaTendik: row.tendik.namaTendik,
          totalAbsen: 0,
          totalHadir: 0,
        });
      }
      const item = grouped.get(key);
      item.totalAbsen += 1;
      if (row.status === "HADIR") item.totalHadir += 1;
    }

    return res.json({
      filter: {
        tendikId: Number.isInteger(tendikId) ? tendikId : null,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      },
      summary: Array.from(grouped.values()),
      detail,
    });
  } catch (error) {
    return next(error);
  }
};
