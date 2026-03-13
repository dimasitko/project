const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controller");
const validateBody = require("../middleware/validation.middleware");
const { CreateUserDto, UpdateUserDto } = require("../dtos/users.dto");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validateBody(CreateUserDto), controller.create);
router.put("/:id", validateBody(UpdateUserDto), controller.update);
router.patch("/:id", validateBody(UpdateUserDto), controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
