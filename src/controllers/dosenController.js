const prisma = require("../lib/prisma");
const { uploadBufferToCloudinary, removeCloudinaryAssetByUrl } = require("../utils/cloudinaryFile");

function parseProdiId(raw) {
  if (raw === undefined || raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

exports.getAll = async (req, res, next) => {
  try {
    const prodiId = parseProdiId(req.query.prodiId);
    const where =
      prodiId !== null && !Number.isNaN(prodiId) ? { prodiId } : {};

    const data = await prisma.dosen.findMany({
      where,
      include: {
        prodi: true,
        bahanAjar: { include: { matakuliah: true } },
        hki: true,
        pengampuMatakuliah: { include: { matakuliah: true } },
      },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.dosen.findUnique({
      where: { id: req.params.id },
      include: {
        prodi: true,
        bahanAjar: { include: { matakuliah: true } },
        hki: true,
        pengampuMatakuliah: { include: { matakuliah: true } },
        penelitianKetua: true,
        pengabdianKetua: true,
      },
    });
    if (!data) return res.status(404).json({ message: "Dosen tidak ditemukan" });
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

    const prodiId = parseProdiId(req.body.prodiId);
    if (prodiId === null || Number.isNaN(prodiId)) {
      return res.status(400).json({ message: "prodiId wajib diisi dan berupa angka valid" });
    }
    const prodi = await prisma.prodi.findUnique({ where: { id: prodiId } });
    if (!prodi) {
      return res.status(400).json({ message: "Prodi tidak ditemukan" });
    }

    const fotoUrl = req.file ? (await uploadBufferToCloudinary(req.file.buffer, "dosen")).secure_url : null;
    const data = await prisma.dosen.create({
      data: {
        nip: req.body.nip,
        email,
        namaDosen: req.body.namaDosen,
        tempatLahir: req.body.tempatLahir,
        tanggalLahir: new Date(req.body.tanggalLahir),
        alamat: req.body.alamat,
        telp: req.body.telp,
        foto: fotoUrl,
        prodiId,
      },
      include: { prodi: true },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.dosen.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Dosen tidak ditemukan" });

    let fotoUrl = existing.foto;
    if (req.file) {
      await removeCloudinaryAssetByUrl(existing.foto, "dosen");
      fotoUrl = (await uploadBufferToCloudinary(req.file.buffer, "dosen")).secure_url;
    }

    let email;
    if (req.body.email !== undefined) {
      email = String(req.body.email ?? "").trim();
      if (!email) {
        return res.status(400).json({ message: "Email wajib diisi" });
      }
    }

    const updateData = {
      nip: req.body.nip,
      ...(email !== undefined && { email }),
      namaDosen: req.body.namaDosen,
      tempatLahir: req.body.tempatLahir,
      tanggalLahir: req.body.tanggalLahir ? new Date(req.body.tanggalLahir) : undefined,
      alamat: req.body.alamat,
      telp: req.body.telp,
      foto: fotoUrl,
    };

    if (req.body.prodiId !== undefined) {
      const prodiId = parseProdiId(req.body.prodiId);
      if (prodiId === null || Number.isNaN(prodiId)) {
        return res.status(400).json({ message: "prodiId harus berupa angka valid" });
      }
      const prodi = await prisma.prodi.findUnique({ where: { id: prodiId } });
      if (!prodi) {
        return res.status(400).json({ message: "Prodi tidak ditemukan" });
      }
      updateData.prodiId = prodiId;
    }

    const data = await prisma.dosen.update({
      where: { id: req.params.id },
      data: updateData,
      include: { prodi: true },
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.dosen.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Dosen tidak ditemukan" });

    await removeCloudinaryAssetByUrl(existing.foto, "dosen");
    await prisma.dosen.delete({ where: { id: req.params.id } });

    return res.json({ message: "Dosen berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
