import { Router } from "express";
import {
  createOrderHandler,
  getMyOrders,
  getMyOrder,
  updateOrderStatusHandler,
} from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate); // every order route is user-specific

router.post("/", createOrderHandler);
router.get("/", getMyOrders);
router.get("/:id", getMyOrder);
// NOTE: status changes are normally an admin action - currently just
// "logged in". Restrict once role checks are wired into the JWT/middleware.
router.patch("/:id/status", updateOrderStatusHandler);

export default router;