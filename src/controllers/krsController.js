const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL KRS
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.krs.findMany({
      include: {
        mahasiswa: true,
        matakuliah: true,
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

    const data = await prisma.krs.findUnique({
      where: { id },
      include: {
        mahasiswa: true,
        matakuliah: true,
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE (AMBIL MATAKULIAH)
exports.create = async (req, res) => {
  try {
    const { mahasiswaId, matakuliahId } = req.body;

    const data = await prisma.krs.create({
      data: {
        mahasiswaId: parseInt(mahasiswaId),
        matakuliahId: parseInt(matakuliahId),
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE (DROP MATAKULIAH)
exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.krs.delete({
      where: { id },
    });

    res.json({ message: "KRS berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
