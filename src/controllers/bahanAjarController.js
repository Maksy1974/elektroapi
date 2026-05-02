const prisma = require("../lib/prisma");

const KATEGORI_VALID = new Set(["BUKU", "MODUL"]);

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

async function ensureMatakuliahExists(id) {
  const matakuliah = await prisma.matakuliah.findUnique({ where: { id } });
  return !!matakuliah;
}

async function ensureAllDosenExist(ids) {
  const count = await prisma.dosen.count({ where: { id: { in: ids } } });
  return count === ids.length;
}

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.bahanAjar.findMany({
      include: { matakuliah: true, dosen: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.bahanAjar.findUnique({
      where: { id: req.params.id },
      include: { matakuliah: true, dosen: true },
    });
    if (!data) return res.status(404).json({ message: "Bahan ajar tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const kategori = String(req.body.kategori || "").toUpperCase();
    if (!KATEGORI_VALID.has(kategori)) {
      return res.status(400).json({ message: "kategori wajib diisi: BUKU atau MODUL" });
    }

    const tahun = parseNumber(req.body.tahun);
    const matakuliahId = parseNumber(req.body.matakuliahId);
    if (!Number.isInteger(tahun) || !Number.isInteger(matakuliahId)) {
      return res.status(400).json({ message: "tahun dan matakuliahId wajib berupa angka valid" });
    }

    const dosenIds = parseDosenIds(req.body.dosenIds);
    if (!Array.isArray(dosenIds) || dosenIds.length === 0) {
      return res.status(400).json({ message: "dosenIds wajib diisi minimal 1 dosen" });
    }

    if (!(await ensureMatakuliahExists(matakuliahId))) {
      return res.status(400).json({ message: "Matakuliah tidak ditemukan" });
    }
    if (!(await ensureAllDosenExist(dosenIds))) {
      return res.status(400).json({ message: "Satu atau lebih dosen tidak ditemukan" });
    }

    const data = await prisma.bahanAjar.create({
      data: {
        judul: req.body.judul,
        kategori,
        penerbit: req.body.penerbit || null,
        isbn: req.body.isbn || null,
        tahun,
        matakuliahId,
        dosen: { connect: dosenIds.map((id) => ({ id })) },
      },
      include: { matakuliah: true, dosen: true },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.bahanAjar.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Bahan ajar tidak ditemukan" });

    const updateData = {
      judul: req.body.judul,
      penerbit: req.body.penerbit,
      isbn: req.body.isbn,
      tahun: req.body.tahun !== undefined ? parseNumber(req.body.tahun) : undefined,
    };

    if (req.body.kategori !== undefined) {
      const kategori = String(req.body.kategori || "").toUpperCase();
      if (!KATEGORI_VALID.has(kategori)) {
        return res.status(400).json({ message: "kategori harus BUKU atau MODUL" });
      }
      updateData.kategori = kategori;
    }

    if (req.body.matakuliahId !== undefined) {
      const matakuliahId = parseNumber(req.body.matakuliahId);
      if (!Number.isInteger(matakuliahId)) {
        return res.status(400).json({ message: "matakuliahId harus angka valid" });
      }
      if (!(await ensureMatakuliahExists(matakuliahId))) {
        return res.status(400).json({ message: "Matakuliah tidak ditemukan" });
      }
      updateData.matakuliahId = matakuliahId;
    }

    let dosenUpdate;
    if (req.body.dosenIds !== undefined) {
      const dosenIds = parseDosenIds(req.body.dosenIds);
      if (dosenIds.length === 0) {
        return res.status(400).json({ message: "dosenIds minimal harus berisi 1 dosen" });
      }
      if (!(await ensureAllDosenExist(dosenIds))) {
        return res.status(400).json({ message: "Satu atau lebih dosen tidak ditemukan" });
      }
      dosenUpdate = { set: dosenIds.map((id) => ({ id })) };
    }

    const data = await prisma.bahanAjar.update({
      where: { id: req.params.id },
      data: {
        ...updateData,
        ...(dosenUpdate && { dosen: dosenUpdate }),
      },
      include: { matakuliah: true, dosen: true },
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.bahanAjar.delete({ where: { id: req.params.id } });
    return res.json({ message: "Bahan ajar berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
