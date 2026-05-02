const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.pengampuMatakuliah.findMany({
      include: { dosen: true, matakuliah: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.pengampuMatakuliah.findUnique({
      where: { id: req.params.id },
      include: { dosen: true, matakuliah: true },
    });
    if (!data) return res.status(404).json({ message: "Data pengampu tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await prisma.pengampuMatakuliah.create({
      data: {
        dosenId: Number(req.body.dosenId),
        matakuliahId: Number(req.body.matakuliahId),
        kelas: req.body.kelas,
        semester: Number(req.body.semester),
        tahunAjaran: req.body.tahunAjaran,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await prisma.pengampuMatakuliah.update({
      where: { id: req.params.id },
      data: {
        dosenId: req.body.dosenId !== undefined ? Number(req.body.dosenId) : undefined,
        matakuliahId: req.body.matakuliahId !== undefined ? Number(req.body.matakuliahId) : undefined,
        kelas: req.body.kelas,
        semester: req.body.semester !== undefined ? Number(req.body.semester) : undefined,
        tahunAjaran: req.body.tahunAjaran,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.pengampuMatakuliah.delete({ where: { id: req.params.id } });
    return res.json({ message: "Data pengampu berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
