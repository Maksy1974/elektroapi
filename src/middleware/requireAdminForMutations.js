const crypto = require("crypto");

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * API publik baca saja: GET/HEAD/OPTIONS tanpa token.
 * POST, PUT, PATCH, DELETE wajib header Authorization: Bearer <ADMIN_API_TOKEN>
 */
function requireAdminForMutations(req, res, next) {
  if (READ_METHODS.has(req.method)) {
    return next();
  }

  const secret = process.env.ADMIN_API_TOKEN;
  if (!secret || String(secret).length < 16) {
    return res.status(503).json({
      message:
        "Mutasi API dinonaktifkan: atur ADMIN_API_TOKEN di .env (minimal 16 karakter).",
    });
  }

  const auth = req.get("Authorization") || "";
  const m = /^Bearer\s+(\S+)$/i.exec(auth.trim());
  if (!m) {
    return res.status(401).json({
      message:
        "Autentikasi diperlukan untuk operasi ini. Kirim header: Authorization: Bearer <token_admin>",
    });
  }

  const token = m[1];
  const a = Buffer.from(String(secret), "utf8");
  const b = Buffer.from(token, "utf8");

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ message: "Token admin tidak valid" });
  }

  return next();
}

module.exports = { requireAdminForMutations };
