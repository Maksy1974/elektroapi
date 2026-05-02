const prisma = require("../lib/prisma");

const HARI_VALID = new Set(["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"]);
const LOKASI_VALID = new Set(["RUANG_KELAS", "LABORATORIUM"]);

function parseNumber(raw) {
  if (raw === undefined || raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

function toTimeDate(value) {
  if (!value || typeof value !== "string") return null;
  const asDate = new Date(`1970-01-01T${value}:00`);
  return Number.isNaN(asDate.getTime()) ? null : asDate;
}

function parseDosenIds(raw) {
  if (raw === undefined) return undefined;
  if (raw === null || raw === "") return [];

  let values = raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      values = JSON.parse(trimmed);
    } else {
      values = trimmed.split(",").map((item) => item.trim());
    }
  }

  if (!Array.isArray(values)) {
    throw new Error("dosenIds harus array atau daftar id dipisah koma");
  }

  const ids = values.map((value) => Number(value));
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error("dosenIds hanya boleh berisi angka id dosen yang valid");
  }
  return [...new Set(ids)];
}

async function ensureAllDosenExist(ids) {
  const count = await prisma.dosen.count({ where: { id: { in: ids } } });
  return count === ids.length;
}

function inferLokasiFromKategori(rawKategori) {
  const kategori = String(rawKategori || "").toLowerCase();
  if (kategori.includes("praktik") || kategori.includes("praktek")) return "LABORATORIUM";
  if (kategori.includes("teori")) return "RUANG_KELAS";
  return null;
}

async function validateLokasiWithMatakuliah({ lokasiPerkuliahan, laboratoriumId, ruangKelas, matakuliahId }) {
  const matakuliah = await prisma.matakuliah.findUnique({
    where: { id: matakuliahId },
    include: { laboratorium: true },
  });
  if (!matakuliah) {
    return { ok: false, message: "Matakuliah tidak ditemukan" };
  }

  const expectedLokasi = inferLokasiFromKategori(matakuliah.kategori);
  if (expectedLokasi && expectedLokasi !== lokasiPerkuliahan) {
    return {
      ok: false,
      message:
        expectedLokasi === "LABORATORIUM"
          ? "Mata kuliah praktik/praktek wajib menggunakan lokasi LABORATORIUM"
          : "Mata kuliah teori wajib menggunakan lokasi RUANG_KELAS",
    };
  }

  if (lokasiPerkuliahan === "LABORATORIUM") {
    if (!Number.isInteger(laboratoriumId)) {
      return { ok: false, message: "laboratoriumId wajib diisi untuk lokasi LABORATORIUM" };
    }
    const laboratorium = await prisma.laboratorium.findUnique({ where: { id: laboratoriumId } });
    if (!laboratorium) return { ok: false, message: "Laboratorium tidak ditemukan" };
  }

  if (lokasiPerkuliahan === "RUANG_KELAS") {
    if (!String(ruangKelas || "").trim()) {
      return { ok: false, message: "ruangKelas wajib diisi untuk lokasi RUANG_KELAS" };
    }
  }

  return { ok: true };
}

exports.getAll = async (req, res, next) => {
  try {
    const prodiId = parseNumber(req.query.prodiId);
    const semester = parseNumber(req.query.semester);
    const tahunAjaran = req.query.tahunAjaran;

    const where = {};
    if (prodiId !== null) where.prodiId = prodiId;
    if (semester !== null) where.semester = semester;
    if (tahunAjaran) where.tahunAjaran = tahunAjaran;

    const data = await prisma.jadwalKuliah.findMany({
      where,
      include: {
        prodi: true,
        dosen: true,
        matakuliah: true,
        laboratorium: true,
      },
      orderBy: [{ hari: "asc" }, { jamMulai: "asc" }],
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await prisma.jadwalKuliah.findUnique({
      where: { id: req.params.id },
      include: {
        prodi: true,
        dosen: true,
        matakuliah: true,
        laboratorium: true,
      },
    });
    if (!data) return res.status(404).json({ message: "Jadwal kuliah tidak ditemukan" });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const hari = String(req.body.hari || "").toUpperCase();
    const lokasiPerkuliahan = String(req.body.lokasiPerkuliahan || "").toUpperCase();
    const prodiId = parseNumber(req.body.prodiId);
    const matakuliahId = parseNumber(req.body.matakuliahId);
    const laboratoriumId =
      req.body.laboratoriumId === undefined || req.body.laboratoriumId === null || req.body.laboratoriumId === ""
        ? null
        : parseNumber(req.body.laboratoriumId);
    const ruangKelas = req.body.ruangKelas ? String(req.body.ruangKelas).trim() : null;
    const semester = parseNumber(req.body.semester);
    const jamMulai = toTimeDate(req.body.jamMulai);
    const jamSelesai = toTimeDate(req.body.jamSelesai);
    let dosenIds;
    try {
      dosenIds = parseDosenIds(req.body.dosenIds);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!HARI_VALID.has(hari)) return res.status(400).json({ message: "hari tidak valid" });
    if (!LOKASI_VALID.has(lokasiPerkuliahan)) {
      return res.status(400).json({ message: "lokasiPerkuliahan harus RUANG_KELAS atau LABORATORIUM" });
    }
    if (![prodiId, matakuliahId, semester].every((x) => Number.isInteger(x))) {
      return res.status(400).json({ message: "prodiId, matakuliahId, semester wajib angka valid" });
    }
    if (!Array.isArray(dosenIds) || dosenIds.length === 0) {
      return res.status(400).json({ message: "dosenIds wajib diisi minimal 1 dosen" });
    }
    if (!(await ensureAllDosenExist(dosenIds))) {
      return res.status(400).json({ message: "Satu atau lebih dosen tidak ditemukan" });
    }
    if (!jamMulai || !jamSelesai) {
      return res.status(400).json({ message: "jamMulai dan jamSelesai wajib format HH:mm" });
    }
    if (jamSelesai <= jamMulai) {
      return res.status(400).json({ message: "jamSelesai harus lebih besar dari jamMulai" });
    }
    const lokasiValidation = await validateLokasiWithMatakuliah({
      lokasiPerkuliahan,
      laboratoriumId,
      ruangKelas,
      matakuliahId,
    });
    if (!lokasiValidation.ok) {
      return res.status(400).json({ message: lokasiValidation.message });
    }

    const data = await prisma.jadwalKuliah.create({
      data: {
        prodiId,
        matakuliahId,
        dosen: { connect: dosenIds.map((id) => ({ id })) },
        lokasiPerkuliahan,
        laboratoriumId: lokasiPerkuliahan === "LABORATORIUM" ? laboratoriumId : null,
        ruangKelas: lokasiPerkuliahan === "RUANG_KELAS" ? ruangKelas : null,
        kelas: req.body.kelas,
        semester,
        tahunAjaran: req.body.tahunAjaran,
        hari,
        jamMulai,
        jamSelesai,
      },
      include: {
        prodi: true,
        dosen: true,
        matakuliah: true,
        laboratorium: true,
      },
    });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.jadwalKuliah.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Jadwal kuliah tidak ditemukan" });

    const dataUpdate = {
      kelas: req.body.kelas,
      tahunAjaran: req.body.tahunAjaran,
    };

    let dosenUpdate;

    if (req.body.hari !== undefined) {
      const hari = String(req.body.hari || "").toUpperCase();
      if (!HARI_VALID.has(hari)) return res.status(400).json({ message: "hari tidak valid" });
      dataUpdate.hari = hari;
    }

    if (req.body.prodiId !== undefined) dataUpdate.prodiId = parseNumber(req.body.prodiId);
    if (req.body.matakuliahId !== undefined) dataUpdate.matakuliahId = parseNumber(req.body.matakuliahId);
    if (req.body.semester !== undefined) dataUpdate.semester = parseNumber(req.body.semester);
    if (req.body.lokasiPerkuliahan !== undefined) {
      const lokasiPerkuliahan = String(req.body.lokasiPerkuliahan || "").toUpperCase();
      if (!LOKASI_VALID.has(lokasiPerkuliahan)) {
        return res.status(400).json({ message: "lokasiPerkuliahan harus RUANG_KELAS atau LABORATORIUM" });
      }
      dataUpdate.lokasiPerkuliahan = lokasiPerkuliahan;
    }
    if (req.body.ruangKelas !== undefined) {
      dataUpdate.ruangKelas = req.body.ruangKelas === null ? null : String(req.body.ruangKelas).trim();
    }
    if (req.body.laboratoriumId !== undefined) {
      dataUpdate.laboratoriumId = req.body.laboratoriumId === "" || req.body.laboratoriumId === null
        ? null
        : parseNumber(req.body.laboratoriumId);
    }
    if (req.body.jamMulai !== undefined) dataUpdate.jamMulai = toTimeDate(req.body.jamMulai);
    if (req.body.jamSelesai !== undefined) dataUpdate.jamSelesai = toTimeDate(req.body.jamSelesai);

    if (req.body.dosenIds !== undefined) {
      let dosenIds;
      try {
        dosenIds = parseDosenIds(req.body.dosenIds);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
      if (dosenIds.length === 0) {
        return res.status(400).json({ message: "dosenIds minimal harus berisi 1 dosen" });
      }
      if (!(await ensureAllDosenExist(dosenIds))) {
        return res.status(400).json({ message: "Satu atau lebih dosen tidak ditemukan" });
      }
      dosenUpdate = { set: dosenIds.map((id) => ({ id })) };
    }

    const effectiveMatakuliahId = dataUpdate.matakuliahId ?? existing.matakuliahId;
    const effectiveLokasi = dataUpdate.lokasiPerkuliahan ?? existing.lokasiPerkuliahan;
    const effectiveLabId =
      dataUpdate.laboratoriumId !== undefined ? dataUpdate.laboratoriumId : existing.laboratoriumId;
    const effectiveRuangKelas =
      dataUpdate.ruangKelas !== undefined ? dataUpdate.ruangKelas : existing.ruangKelas;

    const lokasiValidation = await validateLokasiWithMatakuliah({
      lokasiPerkuliahan: effectiveLokasi,
      laboratoriumId: effectiveLabId,
      ruangKelas: effectiveRuangKelas,
      matakuliahId: effectiveMatakuliahId,
    });
    if (!lokasiValidation.ok) {
      return res.status(400).json({ message: lokasiValidation.message });
    }

    if (effectiveLokasi === "LABORATORIUM") {
      dataUpdate.ruangKelas = null;
    } else if (effectiveLokasi === "RUANG_KELAS") {
      dataUpdate.laboratoriumId = null;
    }

    const data = await prisma.jadwalKuliah.update({
      where: { id: req.params.id },
      data: {
        ...dataUpdate,
        ...(dosenUpdate && { dosen: dosenUpdate }),
      },
      include: {
        prodi: true,
        dosen: true,
        matakuliah: true,
        laboratorium: true,
      },
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.jadwalKuliah.delete({ where: { id: req.params.id } });
    return res.json({ message: "Jadwal kuliah berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
};
