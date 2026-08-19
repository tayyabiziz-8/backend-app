import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public - browsing
router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected - management
router.post("/", authenticate, createProductHandler);
router.patch("/:id", authenticate, updateProductHandler);
router.delete("/:id", authenticate, deleteProductHandler);

export default router;