const express = require("express");
const controller = require("../controllers/penelitianController");
const { validateIdParam } = require("../middleware/validateId");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validateIdParam, controller.getById);
router.post("/", controller.create);
router.put("/:id", validateIdParam, controller.update);
router.delete("/:id", validateIdParam, controller.remove);
router.post("/:id/anggota", validateIdParam, controller.addMember);
router.delete("/:id/anggota/:memberId", validateIdParam, controller.removeMember);

module.exports = router;
