import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cart.service.js";

export const getMyCart = asyncHandler(async (req, res) => {
  const data = await getCart(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, "Cart fetched successfully"));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const data = await addItemToCart(req.user.id, { productId, quantity });
  return res.status(201).json(new ApiResponse(201, data, "Item added to cart"));
});

export const updateCartItemHandler = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const data = await updateCartItem(req.user.id, itemId, { quantity });
  return res.status(200).json(new ApiResponse(200, data, "Cart item updated"));
});

export const removeCartItemHandler = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const data = await removeCartItem(req.user.id, itemId);
  return res.status(200).json(new ApiResponse(200, data, "Item removed from cart"));
});

export const clearCartHandler = asyncHandler(async (req, res) => {
  const data = await clearCart(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, "Cart cleared"));
});