import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { categoryId, search, page, limit } = req.query;
  const data = await listProducts({ categoryId, search, page, limit });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Products fetched successfully"));
});
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await getProductById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Product fetched successfully"));
});
export const createProductHandler = asyncHandler(async (req, res) => {
  const data = await createProduct(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, data, "Product created successfully"));
});
export const updateProductHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await updateProduct(id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Product updated successfully"));
});
export const deleteProductHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await deleteProduct(id);
  return res.status(200).json(new ApiResponse(200, data, data.message));
});