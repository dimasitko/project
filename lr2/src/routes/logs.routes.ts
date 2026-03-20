import { Router } from "express";
import controller from "../controllers/logs.controller";
import validateBody from "../middleware/validation.middleware";
import { CreateLogDto } from "../dtos/logs.dto";

const router = Router();

router.get("/", controller.getAll.bind(controller));
router.post("/", validateBody(CreateLogDto), controller.create.bind(controller));

export default router;