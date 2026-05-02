const express = require("express");
const controller = require("../controllers/tendikController");
const absenController = require("../controllers/absenTendikController");
const upload = require("../middleware/upload");
const { validateIdParam } = require("../middleware/validateId");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validateIdParam, controller.getById);
router.post("/", upload.single("foto"), controller.create);
router.put("/:id", validateIdParam, upload.single("foto"), controller.update);
router.delete("/:id", validateIdParam, controller.remove);

router.post("/:id/absen", validateIdParam, absenController.create);
router.get("/:id/absen", validateIdParam, absenController.getByTendik);
router.get("/laporan/kehadiran", absenController.report);

module.exports = router;
