const express = require("express");
const controller = require("../controllers/khsController");
const { validateIdParam } = require("../middleware/validateId");

const router = express.Router();

router.get("/:id", validateIdParam, controller.getByMahasiswa);

module.exports = router;
