import {
  sequelize,
  Cart,
  CartItem,
  Product,
  Order,
  OrderItem,
} from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

const orderInclude = [
  {
    model: OrderItem,
    as: "items",
    include: [{ model: Product, as: "product", attributes: ["id", "name", "slug", "images"] }],
  },
];

export const createOrder = async (userId, { shippingAddress, paymentMethod }) => {
  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  const cart = await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }],
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  // Validate stock up front so we fail before opening the transaction
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw new ApiError(400, `Product in cart is no longer available`);
    }
    if (item.product.stock < item.quantity) {
      throw new ApiError(400, `Not enough stock for ${item.product.name}`);
    }
  }

  const totalAmount = cart.items.reduce((sum, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return sum + Number(unitPrice) * item.quantity;
  }, 0);

  const transaction = await sequelize.transaction();
  let orderId;
  try {
    const order = await Order.create(
      {
        userId,
        status: "pending",
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: "pending",
      },
      { transaction }
    );

    for (const item of cart.items) {
      const unitPrice = item.product.discountPrice ?? item.product.price;
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: unitPrice,
        },
        { transaction }
      );

      await item.product.decrement("stock", { by: item.quantity, transaction });
    }

    await CartItem.destroy({ where: { cartId: cart.id }, transaction });

    orderId = order.id;
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  return Order.findByPk(orderId, { include: orderInclude });
};

export const listOrders = async (userId) => {
  return Order.findAll({
    where: { userId },
    include: orderInclude,
    order: [["created_at", "DESC"]],
  });
};

export const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: orderInclude,
  });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export const updateOrderStatus = async (orderId, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();
  return order;
};