const express = require("express");
const controller = require("../controllers/dosenController");
const upload = require("../middleware/upload");
const { validateIdParam } = require("../middleware/validateId");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validateIdParam, controller.getById);
router.post("/", upload.single("foto"), controller.create);
router.put("/:id", validateIdParam, upload.single("foto"), controller.update);
router.delete("/:id", validateIdParam, controller.remove);

module.exports = router;
