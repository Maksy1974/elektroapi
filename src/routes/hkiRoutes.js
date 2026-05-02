const express = require("express");
const controller = require("../controllers/hkiController");
const { validateIdParam } = require("../middleware/validateId");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validateIdParam, controller.getById);
router.post("/", controller.create);
router.put("/:id", validateIdParam, controller.update);
router.delete("/:id", validateIdParam, controller.remove);

module.exports = router;
