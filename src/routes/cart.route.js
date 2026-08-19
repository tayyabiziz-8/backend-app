import { Router } from "express";
import {
  getMyCart,
  addToCart,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate); // every cart route is user-specific

router.get("/", getMyCart);
router.post("/items", addToCart);
router.patch("/items/:itemId", updateCartItemHandler);
router.delete("/items/:itemId", removeCartItemHandler);
router.delete("/", clearCartHandler);

export default router;