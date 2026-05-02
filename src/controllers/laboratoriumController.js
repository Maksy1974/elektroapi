const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.laboratorium.findMany({
      include: { matakuliah: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.laboratorium.findUnique({
      where: { id: req.params.id },
      include: { matakuliah: true },
    });
    if (!data) return res.status(404).json({ message: "Laboratorium tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await prisma.laboratorium.create({
      data: {
        namaLab: req.body.namaLab,
        kepalaLab: req.body.kepalaLab,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await prisma.laboratorium.update({
      where: { id: req.params.id },
      data: {
        namaLab: req.body.namaLab,
        kepalaLab: req.body.kepalaLab,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.laboratorium.delete({ where: { id: req.params.id } });
    return res.json({ message: "Laboratorium berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
