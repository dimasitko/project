import { Router } from "express";
import controller from "../controllers/logs.controller";

const router = Router();

router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));

export default router;
