import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";

export const getCategories = asyncHandler(async (req, res) => {
  const { parentId } = req.query;
  const data = await listCategories({ parentId });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Categories fetched successfully"));
});

export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await getCategoryById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Category fetched successfully"));
});

export const createCategoryHandler = asyncHandler(async (req, res) => {
  const { name, description, image, parentId } = req.body;
  const data = await createCategory({ name, description, image, parentId });
  return res
    .status(201)
    .json(new ApiResponse(201, data, "Category created successfully"));
});

export const updateCategoryHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await updateCategory(id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Category updated successfully"));
});

export const deleteCategoryHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await deleteCategory(id);
  return res.status(200).json(new ApiResponse(200, data, data.message));
});