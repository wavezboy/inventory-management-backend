import { Router } from "express";
import * as salesLogController from "../controllers/salesLogController";

const router = Router();

router.post("/", salesLogController.createLog);
router.get("/:accountType/:logId", salesLogController.getLog);
router.get("/:accountType", salesLogController.getLogs);
router.post("/:accountType/:logId", salesLogController.updateSalesLog);

export default router;
