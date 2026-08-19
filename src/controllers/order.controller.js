import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/order.service.js";

export const createOrderHandler = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const data = await createOrder(req.user.id, { shippingAddress, paymentMethod });
  return res.status(201).json(new ApiResponse(201, data, "Order placed successfully"));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const data = await listOrders(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, "Orders fetched successfully"));
});

export const getMyOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await getOrderById(req.user.id, id);
  return res.status(200).json(new ApiResponse(200, data, "Order fetched successfully"));
});

export const updateOrderStatusHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = await updateOrderStatus(id, status);
  return res.status(200).json(new ApiResponse(200, data, "Order status updated"));
});