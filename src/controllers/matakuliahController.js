const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.matakuliah.findMany({
      include: {
        prodi: true,
        laboratorium: true,
        bahanAjar: { include: { dosen: true } },
        pengampu: { include: { dosen: true } },
        krs: { include: { mahasiswa: true } },
      },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.matakuliah.findUnique({
      where: { id: req.params.id },
      include: {
        prodi: true,
        laboratorium: true,
        bahanAjar: { include: { dosen: true } },
        pengampu: { include: { dosen: true } },
        krs: { include: { mahasiswa: true } },
      },
    });
    if (!data) return res.status(404).json({ message: "Matakuliah tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await prisma.matakuliah.create({
      data: {
        kodeMatakuliah: req.body.kodeMatakuliah,
        nama: req.body.nama,
        sks: Number(req.body.sks),
        deskripsiMatakuliah: req.body.deskripsiMatakuliah,
        kategori: req.body.kategori,
        semester: Number(req.body.semester),
        prodiId: Number(req.body.prodiId),
        laboratoriumId:
          req.body.laboratoriumId !== undefined &&
          req.body.laboratoriumId !== null &&
          req.body.laboratoriumId !== ""
            ? Number(req.body.laboratoriumId)
            : null,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await prisma.matakuliah.update({
      where: { id: req.params.id },
      data: {
        kodeMatakuliah: req.body.kodeMatakuliah,
        nama: req.body.nama,
        sks: req.body.sks !== undefined ? Number(req.body.sks) : undefined,
        deskripsiMatakuliah: req.body.deskripsiMatakuliah,
        kategori: req.body.kategori,
        semester: req.body.semester !== undefined ? Number(req.body.semester) : undefined,
        prodiId: req.body.prodiId !== undefined ? Number(req.body.prodiId) : undefined,
        laboratoriumId:
          req.body.laboratoriumId !== undefined
            ? req.body.laboratoriumId === null || req.body.laboratoriumId === ""
              ? null
              : Number(req.body.laboratoriumId)
            : undefined,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.matakuliah.delete({ where: { id: req.params.id } });
    return res.json({ message: "Matakuliah berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
