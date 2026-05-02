const prisma = require("../lib/prisma");
const { uploadBufferToCloudinary, removeCloudinaryAssetByUrl } = require("../utils/cloudinaryFile");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.mahasiswa.findMany({
      include: {
        prodi: { include: { jurusan: true } },
        kartu: true,
        krs: { include: { matakuliah: true } },
      },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.mahasiswa.findUnique({
      where: { id: req.params.id },
      include: {
        prodi: { include: { jurusan: true } },
        kartu: true,
        krs: { include: { matakuliah: true } },
      },
    });

    if (!data) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const email = String(req.body.email ?? "").trim();
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const fotoUrl = req.file
      ? (await uploadBufferToCloudinary(req.file.buffer, "mahasiswa")).secure_url
      : null;

    const data = await prisma.mahasiswa.create({
      data: {
        nama: req.body.nama,
        nim: req.body.nim,
        email,
        alamat: req.body.alamat,
        telp: req.body.telp,
        tempatLahir: req.body.tempatLahir,
        tanggalLahir: new Date(req.body.tanggalLahir),
        semester: Number(req.body.semester),
        prodiId: Number(req.body.prodiId),
        foto: fotoUrl,
      },
    });

    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.mahasiswa.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

    let fotoUrl = existing.foto;
    if (req.file) {
      await removeCloudinaryAssetByUrl(existing.foto, "mahasiswa");
      fotoUrl = (await uploadBufferToCloudinary(req.file.buffer, "mahasiswa")).secure_url;
    }

    let email;
    if (req.body.email !== undefined) {
      email = String(req.body.email ?? "").trim();
      if (!email) {
        return res.status(400).json({ message: "Email wajib diisi" });
      }
    }

    const data = await prisma.mahasiswa.update({
      where: { id: req.params.id },
      data: {
        nama: req.body.nama,
        nim: req.body.nim,
        ...(email !== undefined && { email }),
        alamat: req.body.alamat,
        telp: req.body.telp,
        tempatLahir: req.body.tempatLahir,
        tanggalLahir: req.body.tanggalLahir ? new Date(req.body.tanggalLahir) : undefined,
        semester: req.body.semester !== undefined ? Number(req.body.semester) : undefined,
        prodiId: req.body.prodiId !== undefined ? Number(req.body.prodiId) : undefined,
        foto: fotoUrl,
      },
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.mahasiswa.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

    await removeCloudinaryAssetByUrl(existing.foto, "mahasiswa");
    await prisma.mahasiswa.delete({ where: { id: req.params.id } });

    return res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
