const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.prodi.findMany({
      include: { jurusan: true, mahasiswa: true, matakuliah: true, dosen: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.prodi.findUnique({
      where: { id: req.params.id },
      include: { jurusan: true, mahasiswa: true, matakuliah: true, dosen: true },
    });
    if (!data) return res.status(404).json({ message: "Prodi tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await prisma.prodi.create({
      data: {
        nama: req.body.nama,
        namaKaprodi: req.body.namaKaprodi,
        peringkatAkreditasi: req.body.peringkatAkreditasi,
        jurusanId: req.body.jurusanId ? Number(req.body.jurusanId) : null,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await prisma.prodi.update({
      where: { id: req.params.id },
      data: {
        nama: req.body.nama,
        namaKaprodi: req.body.namaKaprodi,
        peringkatAkreditasi: req.body.peringkatAkreditasi,
        jurusanId: req.body.jurusanId !== undefined ? Number(req.body.jurusanId) : undefined,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.prodi.delete({ where: { id: req.params.id } });
    return res.json({ message: "Prodi berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
