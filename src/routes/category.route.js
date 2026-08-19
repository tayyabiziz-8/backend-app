import { Router } from "express";
import {
  getCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public - browsing
router.get("/", getCategories);
router.get("/:id", getCategory);

// Protected - management
// NOTE: currently just "logged in", not role-restricted. Add an isAdmin
// check once the JWT payload / auth.middleware carries the user's role.
router.post("/", authenticate, createCategoryHandler);
router.patch("/:id", authenticate, updateCategoryHandler);
router.delete("/:id", authenticate, deleteCategoryHandler);

export default router;