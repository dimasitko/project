const express = require("express");
const router = express.Router();
const controller = require("../controllers/passes.controller");
const validateBody = require("../middleware/validation.middleware");
const { CreatePassDto, UpdatePassDto } = require("../dtos/passes.dto");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validateBody(CreatePassDto), controller.create);
router.put("/:id", validateBody(UpdatePassDto), controller.update);
router.patch("/:id", validateBody(UpdatePassDto), controller.patch);
router.delete("/:id", controller.delete);

module.exports = router;
