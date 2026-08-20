import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  listReviewsForProduct,
  createReview,
  updateReview,
  deleteReview,
} from "../services/review.service.js";

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const data = await listReviewsForProduct(productId);
  return res.status(200).json(new ApiResponse(200, data, "Reviews fetched successfully"));
});

export const createReviewHandler = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const data = await createReview(req.user.id, { productId, rating, comment });
  return res.status(201).json(new ApiResponse(201, data, "Review submitted successfully"));
});

export const updateReviewHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const data = await updateReview(req.user.id, id, { rating, comment });
  return res.status(200).json(new ApiResponse(200, data, "Review updated successfully"));
});

export const deleteReviewHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await deleteReview(req.user.id, id);
  return res.status(200).json(new ApiResponse(200, data, data.message));
});