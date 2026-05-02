const express = require("express");
const multer = require("multer");
const controller = require("../controllers/jurusanController");
const { validateIdParam } = require("../middleware/validateId");

const router = express.Router();
const parseMultipartFields = multer().none();

router.get("/", controller.getAll);
router.get("/:id", validateIdParam, controller.getById);
router.post("/", parseMultipartFields, controller.create);
router.put("/:id", validateIdParam, parseMultipartFields, controller.update);
router.delete("/:id", validateIdParam, controller.remove);

module.exports = router;
