const express = require("express");
const router = express.Router();
const controller = require("../controllers/logs.controller");
const validateBody = require("../middleware/validation.middleware");
const { CreateLogDto } = require("../dtos/logs.dto");

router.get("/", controller.getAll);
router.post("/", validateBody(CreateLogDto), controller.create);

module.exports = router;