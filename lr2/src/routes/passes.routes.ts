import { Router } from "express";
import controller from "../controllers/passes.controller";
import validateBody from "../middleware/validation.middleware";
import { CreatePassDto, UpdatePassDto } from "../dtos/passes.dto";

const router = Router();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", validateBody(CreatePassDto), controller.create.bind(controller));
router.put("/:id", validateBody(UpdatePassDto), controller.update.bind(controller));
router.patch("/:id", validateBody(UpdatePassDto), controller.patch.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;