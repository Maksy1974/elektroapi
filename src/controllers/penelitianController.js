const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.penelitian.findMany({
      include: {
        ketua: true,
        anggota: { include: { dosen: true } },
        publikasiJurnal: true,
        hki: true,
      },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.penelitian.findUnique({
      where: { id: req.params.id },
      include: {
        ketua: true,
        anggota: { include: { dosen: true } },
        publikasiJurnal: true,
        hki: true,
      },
    });
    if (!data) return res.status(404).json({ message: "Penelitian tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const anggota = Array.isArray(req.body.anggota) ? req.body.anggota : [];

    const data = await prisma.penelitian.create({
      data: {
        judul: req.body.judul,
        topik: req.body.topik,
        sumberDana: req.body.sumberDana,
        namaHibah: req.body.namaHibah,
        tahun: Number(req.body.tahun),
        ketuaId: Number(req.body.ketuaId),
        anggota: {
          create: anggota.map((item) => ({
            dosenId: Number(item.dosenId),
            peran: item.peran || null,
          })),
        },
      },
      include: { anggota: true },
    });

    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await prisma.penelitian.update({
      where: { id: req.params.id },
      data: {
        judul: req.body.judul,
        topik: req.body.topik,
        sumberDana: req.body.sumberDana,
        namaHibah: req.body.namaHibah,
        tahun: req.body.tahun !== undefined ? Number(req.body.tahun) : undefined,
        ketuaId: req.body.ketuaId !== undefined ? Number(req.body.ketuaId) : undefined,
      },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.penelitian.delete({ where: { id: req.params.id } });
    return res.json({ message: "Penelitian berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const data = await prisma.anggotaPenelitian.create({
      data: {
        penelitianId: req.params.id,
        dosenId: Number(req.body.dosenId),
        peran: req.body.peran || null,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    await prisma.anggotaPenelitian.delete({
      where: { id: Number(req.params.memberId) },
    });
    return res.json({ message: "Anggota penelitian berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
