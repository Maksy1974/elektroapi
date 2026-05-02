const prisma = require("../lib/prisma");
const { uploadBufferToCloudinary, removeCloudinaryAssetByUrl } = require("../utils/cloudinaryFile");

exports.getAll = async (req, res, next) => {
  try {
    const data = await prisma.tendik.findMany({
      include: { absen: true },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.tendik.findUnique({
      where: { id: req.params.id },
      include: { absen: true },
    });
    if (!data) return res.status(404).json({ message: "Tendik tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const fotoUrl = req.file ? (await uploadBufferToCloudinary(req.file.buffer, "tendik")).secure_url : null;
    const data = await prisma.tendik.create({
      data: {
        nip: req.body.nip,
        namaTendik: req.body.namaTendik,
        alamatTendik: req.body.alamatTendik,
        notelpTendik: req.body.notelpTendik,
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
    const existing = await prisma.tendik.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Tendik tidak ditemukan" });

    let fotoUrl = existing.foto;
    if (req.file) {
      await removeCloudinaryAssetByUrl(existing.foto, "tendik");
      fotoUrl = (await uploadBufferToCloudinary(req.file.buffer, "tendik")).secure_url;
    }

    const data = await prisma.tendik.update({
      where: { id: req.params.id },
      data: {
        nip: req.body.nip,
        namaTendik: req.body.namaTendik,
        alamatTendik: req.body.alamatTendik,
        notelpTendik: req.body.notelpTendik,
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
    const existing = await prisma.tendik.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Tendik tidak ditemukan" });

    await removeCloudinaryAssetByUrl(existing.foto, "tendik");
    await prisma.tendik.delete({ where: { id: req.params.id } });

    return res.json({ message: "Tendik berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
