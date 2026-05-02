const prisma = require("../lib/prisma");

function jurusanBody(req) {
  const b = req.body || {};
  return {
    namaJurusan: b.namaJurusan ?? b.namajurusan,
    kajur: b.kajur,
  };
}

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.jurusan.findMany({ include: { prodi: true } });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.jurusan.findUnique({
      where: { id: req.params.id },
      include: { prodi: true },
    });
    if (!data) return res.status(404).json({ message: "Jurusan tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { namaJurusan, kajur } = jurusanBody(req);
    const data = await prisma.jurusan.create({
      data: {
        namaJurusan,
        kajur,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { namaJurusan, kajur } = jurusanBody(req);
    const data = await prisma.jurusan.update({
      where: { id: req.params.id },
      data: {
        namaJurusan,
        kajur,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.jurusan.delete({ where: { id: req.params.id } });
    return res.json({ message: "Jurusan berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
