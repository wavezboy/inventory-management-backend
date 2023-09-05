import { Router } from "express";
import * as productController from "../controllers/productController";

const router = Router();

router.post("/:accountType", productController.createProduct);
router.get("/:accountType/:productId", productController.getProduct);
router.get("/:accountType", productController.getProducts);
router.delete("/:accountType/:productId", productController.deleteProduct);
router.patch("/:accountType/:productId", productController.updateProduct);

export default router;
