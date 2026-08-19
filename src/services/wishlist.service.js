import { Wishlist, Product } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export const getWishlist = async (userId) => {
  return Wishlist.findAll({
    where: { userId },
    include: [{ model: Product, as: "product" }],
    order: [["id", "DESC"]],
  });
};

export const addToWishlist = async (userId, productId) => {
  if (!productId) {
    throw new ApiError(400, "productId is required");
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existing = await Wishlist.findOne({ where: { userId, productId } });
  if (existing) {
    throw new ApiError(400, "Product already in wishlist");
  }

  await Wishlist.create({ userId, productId });
  return getWishlist(userId);
};

export const removeFromWishlist = async (userId, productId) => {
  const item = await Wishlist.findOne({ where: { userId, productId } });
  if (!item) {
    throw new ApiError(404, "Item not found in wishlist");
  }
  await item.destroy();
  return getWishlist(userId);
};