const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/mahasiswaController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
// router.post("/", controller.create);
// router.put("/:id", controller.update);
router.post("/", upload.single("foto"), controller.create);
router.put("/:id", upload.single("foto"), controller.update);
router.delete("/:id", controller.remove);
module.exports = router;
