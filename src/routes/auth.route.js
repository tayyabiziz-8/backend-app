import express from "express";
import {
    register,
    login,
    logout,
    changePassword,
    getCurrentUser,
    addProfilePicture,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
// NOT PROTECTED, SHOULD BE - FOR TESTING
router.post("/add-profile-picture/:id", upload.single("profilePicture"), addProfilePicture);

// Protected routes (require a valid Bearer token)
router.post("/logout", authenticate, logout);
router.post("/change-password", authenticate, changePassword);
router.get("/me", authenticate, getCurrentUser);

export default router;