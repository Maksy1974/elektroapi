const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.publikasiJurnal.findMany({
      include: { dosen: true, penelitian: true, pengabdian: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.publikasiJurnal.findUnique({
      where: { id: req.params.id },
      include: { dosen: true, penelitian: true, pengabdian: true },
    });
    if (!data) return res.status(404).json({ message: "Publikasi jurnal tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await prisma.publikasiJurnal.create({
      data: {
        judul: req.body.judul,
        namaJurnal: req.body.namaJurnal,
        tahun: Number(req.body.tahun),
        doi: req.body.doi || null,
        url: req.body.url || null,
        dosenId: Number(req.body.dosenId),
        penelitianId: req.body.penelitianId ? Number(req.body.penelitianId) : null,
        pengabdianId: req.body.pengabdianId ? Number(req.body.pengabdianId) : null,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await prisma.publikasiJurnal.update({
      where: { id: req.params.id },
      data: {
        judul: req.body.judul,
        namaJurnal: req.body.namaJurnal,
        tahun: req.body.tahun !== undefined ? Number(req.body.tahun) : undefined,
        doi: req.body.doi,
        url: req.body.url,
        dosenId: req.body.dosenId !== undefined ? Number(req.body.dosenId) : undefined,
        penelitianId: req.body.penelitianId !== undefined ? Number(req.body.penelitianId) : undefined,
        pengabdianId: req.body.pengabdianId !== undefined ? Number(req.body.pengabdianId) : undefined,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.publikasiJurnal.delete({ where: { id: req.params.id } });
    return res.json({ message: "Publikasi jurnal berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
