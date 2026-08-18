import express from "express";
import {
    register,
    login,
    logout,
    changePassword,
    getCurrentUser,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require a valid Bearer token)
router.post("/logout", authenticate, logout);
router.post("/change-password", authenticate, changePassword);
router.get("/me", authenticate, getCurrentUser);

export default router;