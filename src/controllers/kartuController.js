const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.kartuMahasiswa.findMany({
      include: {
        mahasiswa: true,
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const data = await prisma.kartuMahasiswa.findUnique({
      where: { id },
      include: {
        mahasiswa: true,
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE (BUAT KARTU)
exports.create = async (req, res) => {
  try {
    const { nomorKartu, mahasiswaId } = req.body;

    const data = await prisma.kartuMahasiswa.create({
      data: {
        nomorKartu,
        mahasiswaId: parseInt(mahasiswaId),
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nomorKartu } = req.body;

    const data = await prisma.kartuMahasiswa.update({
      where: { id },
      data: { nomorKartu },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.kartuMahasiswa.delete({
      where: { id },
    });

    res.json({ message: "Kartu berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
