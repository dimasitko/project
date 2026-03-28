import { Router } from "express";
import controller from "../controllers/passes.controller";

const router = Router();

router.get("/stats", controller.getStats?.bind(controller));
router.get("/with-users", controller.getPassesWithUsers?.bind(controller));
router.get("/vulnerable", controller.searchVulnerable?.bind(controller));

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
