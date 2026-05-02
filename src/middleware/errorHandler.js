const { Prisma } = require("@prisma/client");

function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} tidak ditemukan` });
}

function errorHandler(err, req, res, next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: "Operasi database gagal",
      code: err.code,
      detail: err.meta || null,
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Payload tidak sesuai format yang dibutuhkan",
      detail: err.message,
    });
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || "Terjadi kesalahan pada server",
  });
}

module.exports = { notFound, errorHandler };
