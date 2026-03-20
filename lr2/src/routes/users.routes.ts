import { Router } from "express";
import controller from "../controllers/users.controller";
import validateBody from "../middleware/validation.middleware";
import { CreateUserDto, UpdateUserDto } from "../dtos/users.dto";

const router = Router();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", validateBody(CreateUserDto), controller.create.bind(controller));
router.put("/:id", validateBody(UpdateUserDto), controller.update.bind(controller));
router.patch("/:id", validateBody(UpdateUserDto), controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;