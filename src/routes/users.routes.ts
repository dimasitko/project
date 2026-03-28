import { Router } from "express";
import controller from "../controllers/users.controller";

const router = Router();

router.get("/admins/export", controller.exportAdmins.bind(controller));
router.post("/admins/import", controller.importAdmins.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/",  controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;