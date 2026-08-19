import { Cart, CartItem, Product } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

const cartInclude = [
  {
    model: CartItem,
    as: "items",
    include: [{ model: Product, as: "product" }],
  },
];

const findOrCreateCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });
  return cart;
};

export const getCart = async (userId) => {
  const cart = await findOrCreateCart(userId);
  return Cart.findByPk(cart.id, { include: cartInclude });
};

export const addItemToCart = async (userId, { productId, quantity = 1 }) => {
  if (!productId) {
    throw new ApiError(400, "productId is required");
  }
  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const product = await Product.findByPk(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }
  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }

  const cart = await findOrCreateCart(userId);

  const existingItem = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new ApiError(400, "Not enough stock available");
    }
    existingItem.quantity = newQuantity;
    await existingItem.save();
  } else {
    await CartItem.create({ cartId: cart.id, productId, quantity });
  }

  return Cart.findByPk(cart.id, { include: cartInclude });
};

export const updateCartItem = async (userId, itemId, { quantity }) => {
  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await findOrCreateCart(userId);
  const item = await CartItem.findOne({
    where: { id: itemId, cartId: cart.id },
    include: [{ model: Product, as: "product" }],
  });
  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }
  if (item.product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }

  item.quantity = quantity;
  await item.save();

  return Cart.findByPk(cart.id, { include: cartInclude });
};

export const removeCartItem = async (userId, itemId) => {
  const cart = await findOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }
  await item.destroy();

  return Cart.findByPk(cart.id, { include: cartInclude });
};

export const clearCart = async (userId) => {
  const cart = await findOrCreateCart(userId);
  await CartItem.destroy({ where: { cartId: cart.id } });
  return Cart.findByPk(cart.id, { include: cartInclude });
};