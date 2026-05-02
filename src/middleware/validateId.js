function validateIdParam(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Parameter id harus berupa integer positif" });
  }

  req.params.id = id;
  return next();
}

module.exports = { validateIdParam };
