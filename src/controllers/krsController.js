const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.mahasiswaId !== undefined) where.mahasiswaId = Number(req.query.mahasiswaId);
    if (req.query.semester !== undefined) where.semester = Number(req.query.semester);
    if (req.query.tahunAjaran) where.tahunAjaran = String(req.query.tahunAjaran);

    const data = await prisma.krs.findMany({
      where,
      include: { mahasiswa: true, matakuliah: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.krs.findUnique({
      where: { id: req.params.id },
      include: { mahasiswa: true, matakuliah: true },
    });
    if (!data) return res.status(404).json({ message: "Data KRS tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await prisma.krs.create({
      data: {
        mahasiswaId: Number(req.body.mahasiswaId),
        matakuliahId: Number(req.body.matakuliahId),
        semester: Number(req.body.semester),
        tahunAjaran: String(req.body.tahunAjaran),
        nilai: req.body.nilai !== undefined ? Number(req.body.nilai) : null,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await prisma.krs.update({
      where: { id: req.params.id },
      data: {
        mahasiswaId: req.body.mahasiswaId !== undefined ? Number(req.body.mahasiswaId) : undefined,
        matakuliahId: req.body.matakuliahId !== undefined ? Number(req.body.matakuliahId) : undefined,
        semester: req.body.semester !== undefined ? Number(req.body.semester) : undefined,
        tahunAjaran: req.body.tahunAjaran !== undefined ? String(req.body.tahunAjaran) : undefined,
        nilai: req.body.nilai !== undefined ? Number(req.body.nilai) : undefined,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.krs.delete({ where: { id: req.params.id } });
    return res.json({ message: "KRS berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
