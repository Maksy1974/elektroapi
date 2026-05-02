const prisma = require("../lib/prisma");

function parseNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseDosenIds(raw) {
  if (raw === undefined) return undefined;
  if (raw === null || raw === "") return [];

  let values = raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      values = JSON.parse(trimmed);
    } else {
      values = trimmed.split(",").map((item) => item.trim());
    }
  }

  if (!Array.isArray(values)) {
    throw new Error("dosenIds harus array atau daftar id dipisah koma");
  }

  const ids = values.map((value) => Number(value));
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error("dosenIds hanya boleh berisi angka id dosen yang valid");
  }

  return [...new Set(ids)];
}

async function ensureAllDosenExist(ids) {
  const count = await prisma.dosen.count({ where: { id: { in: ids } } });
  return count === ids.length;
}

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.hki.findMany({
      include: { dosen: true, penelitian: true, pengabdian: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.hki.findUnique({
      where: { id: req.params.id },
      include: { dosen: true, penelitian: true, pengabdian: true },
    });
    if (!data) return res.status(404).json({ message: "Data HKI tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    let dosenIds;
    try {
      dosenIds = parseDosenIds(req.body.dosenIds);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!Array.isArray(dosenIds) || dosenIds.length === 0) {
      return res.status(400).json({ message: "dosenIds wajib diisi minimal 1 dosen" });
    }
    if (!(await ensureAllDosenExist(dosenIds))) {
      return res.status(400).json({ message: "Satu atau lebih dosen tidak ditemukan" });
    }

    const data = await prisma.hki.create({
      data: {
        judul: req.body.judul,
        nomorPendaftaran: req.body.nomorPendaftaran || null,
        jenis: req.body.jenis,
        tahun: Number(req.body.tahun),
        dosen: { connect: dosenIds.map((id) => ({ id })) },
        penelitianId: req.body.penelitianId ? Number(req.body.penelitianId) : null,
        pengabdianId: req.body.pengabdianId ? Number(req.body.pengabdianId) : null,
      },
      include: { dosen: true, penelitian: true, pengabdian: true },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    let dosenUpdate;
    if (req.body.dosenIds !== undefined) {
      let dosenIds;
      try {
        dosenIds = parseDosenIds(req.body.dosenIds);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      if (dosenIds.length === 0) {
        return res.status(400).json({ message: "dosenIds minimal harus berisi 1 dosen" });
      }
      if (!(await ensureAllDosenExist(dosenIds))) {
        return res.status(400).json({ message: "Satu atau lebih dosen tidak ditemukan" });
      }
      dosenUpdate = { set: dosenIds.map((id) => ({ id })) };
    }

    const data = await prisma.hki.update({
      where: { id: req.params.id },
      data: {
        judul: req.body.judul,
        nomorPendaftaran: req.body.nomorPendaftaran,
        jenis: req.body.jenis,
        tahun: req.body.tahun !== undefined ? Number(req.body.tahun) : undefined,
        penelitianId: req.body.penelitianId !== undefined ? parseNumber(req.body.penelitianId) : undefined,
        pengabdianId: req.body.pengabdianId !== undefined ? parseNumber(req.body.pengabdianId) : undefined,
        ...(dosenUpdate && { dosen: dosenUpdate }),
      },
      include: { dosen: true, penelitian: true, pengabdian: true },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.hki.delete({ where: { id: req.params.id } });
    return res.json({ message: "Data HKI berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
