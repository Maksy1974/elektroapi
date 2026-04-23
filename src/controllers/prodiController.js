const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.prodi.findMany({
      include: {
        mahasiswa: true, // tampilkan relasi
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

    const data = await prisma.prodi.findUnique({
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

// CREATE
exports.create = async (req, res) => {
  try {
    const { nama } = req.body;

    const data = await prisma.prodi.create({
      data: { nama },
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
    const { nama } = req.body;

    const data = await prisma.prodi.update({
      where: { id },
      data: { nama },
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

    await prisma.prodi.delete({
      where: { id },
    });

    res.json({ message: "Prodi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
