const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
// GET ALL (include relasi)
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.mahasiswa.findMany({
      include: {
        prodi: true,
        kartu: true,
        krs: {
          include: {
            matakuliah: true,
          },
        },
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

    const data = await prisma.mahasiswa.findUnique({
      where: { id },
      include: {
        prodi: true,
        kartu: true,
        krs: {
          include: {
            matakuliah: true,
          },
        },
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE
// exports.create = async (req, res) => {
//   try {
//     const { nama, nim, jurusan, prodiId } = req.body;

//     const data = await prisma.mahasiswa.create({
//       data: {
//         nama,
//         nim,
//         jurusan,
//         prodiId: parseInt(prodiId),
//       },
//     });

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.create = async (req, res) => {
  try {
    const { nama, nim, jurusan, prodiId } = req.body;

    let fotoUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "mahasiswa" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(req.file.buffer);
      });

      fotoUrl = result.secure_url;
    }

    const data = await prisma.mahasiswa.create({
      data: {
        nama,
        nim,
        jurusan,
        prodiId: parseInt(prodiId),
        foto: fotoUrl,
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
// exports.update = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const { nama, nim, jurusan, prodiId } = req.body;

//     const data = await prisma.mahasiswa.update({
//       where: { id },
//       data: {
//         nama,
//         nim,
//         jurusan,
//         prodiId: parseInt(prodiId),
//       },
//     });

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, nim, jurusan, prodiId } = req.body;

    let fotoUrl;

    // ambil data lama
    const existing = await prisma.mahasiswa.findUnique({
      where: { id },
    });

    if (req.file) {
      // hapus foto lama dari Cloudinary (optional tapi disarankan)
      if (existing.foto) {
        const publicId = existing.foto.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`mahasiswa/${publicId}`);
      }

      // upload foto baru
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "mahasiswa" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(req.file.buffer);
      });

      fotoUrl = result.secure_url;
    }

    const data = await prisma.mahasiswa.update({
      where: { id },
      data: {
        nama,
        nim,
        jurusan,
        prodiId: parseInt(prodiId),
        ...(fotoUrl && { foto: fotoUrl }),
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
// exports.remove = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);

//     await prisma.mahasiswa.delete({
//       where: { id },
//     });

//     res.json({ message: "Mahasiswa berhasil dihapus" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.mahasiswa.findUnique({
      where: { id },
    });

    // hapus foto di cloud
    if (existing?.foto) {
      const publicId = existing.foto.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`mahasiswa/${publicId}`);
    }

    await prisma.mahasiswa.delete({
      where: { id },
    });

    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
