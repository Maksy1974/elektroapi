const prisma = require("../lib/prisma");

exports.getByMahasiswa = async (req, res, next) => {
  try {
    const mahasiswaId = Number(req.params.id);
    const semester = req.query.semester !== undefined ? Number(req.query.semester) : null;
    const tahunAjaran = req.query.tahunAjaran ? String(req.query.tahunAjaran) : null;

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: {
        prodi: { include: { jurusan: true } },
      },
    });
    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    const where = { mahasiswaId };
    if (semester !== null) where.semester = semester;
    if (tahunAjaran) where.tahunAjaran = tahunAjaran;

    const krsRows = await prisma.krs.findMany({
      where,
      include: { matakuliah: true },
      orderBy: [{ semester: "asc" }, { matakuliah: { nama: "asc" } }],
    });

    if (krsRows.length === 0) {
      return res.json({
        jurusan: mahasiswa.prodi?.jurusan?.namaJurusan ?? null,
        programStudi: mahasiswa.prodi?.nama ?? null,
        mahasiswa: mahasiswa.nama,
        nim: mahasiswa.nim,
        semester: semester ?? null,
        tahunAjaran: tahunAjaran ?? null,
        daftarMatakuliah: [],
      });
    }

    const effectiveSemester = semester ?? krsRows[0].semester;
    const effectiveTahunAjaran = tahunAjaran ?? krsRows[0].tahunAjaran;
    const daftarMatakuliah = krsRows
      .filter((row) => row.semester === effectiveSemester && row.tahunAjaran === effectiveTahunAjaran)
      .map((row) => ({
        namaMatakuliah: row.matakuliah.nama,
        kodeMatakuliah: row.matakuliah.kodeMatakuliah,
        nilai: row.nilai,
      }));

    return res.json({
      jurusan: mahasiswa.prodi?.jurusan?.namaJurusan ?? null,
      programStudi: mahasiswa.prodi?.nama ?? null,
      mahasiswa: mahasiswa.nama,
      nim: mahasiswa.nim,
      semester: effectiveSemester,
      tahunAjaran: effectiveTahunAjaran,
      daftarMatakuliah,
    });
  } catch (error) {
    return next(error);
  }
};
