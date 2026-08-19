import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlist.service.js";

export const getMyWishlist = asyncHandler(async (req, res) => {
  const data = await getWishlist(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, "Wishlist fetched successfully"));
});

export const addToWishlistHandler = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const data = await addToWishlist(req.user.id, productId);
  return res.status(201).json(new ApiResponse(201, data, "Product added to wishlist"));
});

export const removeFromWishlistHandler = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const data = await removeFromWishlist(req.user.id, productId);
  return res.status(200).json(new ApiResponse(200, data, "Product removed from wishlist"));
});