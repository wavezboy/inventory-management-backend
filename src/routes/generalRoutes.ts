import { Router } from "express";
import * as generalController from "../controllers/Generalcontroller";

const router = Router();

router.get("/getstores", generalController.getStores);
router.get("/:accountType", generalController.getAuthenticatedAccount);
router.get("/:accountType/getuser/:accountId", generalController.getUsers);
router.post("/:accountType/signup", generalController.signUp);
router.post("/:accountType/login", generalController.logIn);
router.post("/logout", generalController.logOut);

export default router;
