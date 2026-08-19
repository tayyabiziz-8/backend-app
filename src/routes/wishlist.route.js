import { Router } from "express";
import {
  getMyWishlist,
  addToWishlistHandler,
  removeFromWishlistHandler,
} from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", getMyWishlist);
router.post("/", addToWishlistHandler);
router.delete("/:productId", removeFromWishlistHandler);

export default router;