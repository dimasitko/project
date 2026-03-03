
export function createPassRouter() {

const router = Router();

router.get("/", listPass);

router.get("/new", getNewPassTemplate);
router.get("/:id", getPassById);
router.post("/", createPass);
router.put("/:id", updatePass);
router.delete("/:id", deletePass);

return router;
}