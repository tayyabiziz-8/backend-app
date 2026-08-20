import { Router } from "express";
import {
  getProductReviews,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
} from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public: anyone can read reviews for a product
router.get("/product/:productId", getProductReviews);

// Protected: must be logged in to write/edit/delete
router.post("/", authenticate, createReviewHandler);
router.patch("/:id", authenticate, updateReviewHandler);
router.delete("/:id", authenticate, deleteReviewHandler);

export default router;