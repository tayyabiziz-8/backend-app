import { Category } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

const slugify = (str) =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const listCategories = async ({ parentId } = {}) => {
  const where = {};
  if (parentId !== undefined) {
    where.parentId = parentId === "null" ? null : parentId;
  }
  return Category.findAll({
    where,
    include: [{ association: "subCategories" }],
    order: [["id", "ASC"]],
  });
};

export const getCategoryById = async (id) => {
  const category = await Category.findByPk(id, {
    include: [{ association: "subCategories" }, { association: "parent" }],
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
};

export const createCategory = async ({ name, description, image, parentId }) => {
  if (!name) {
    throw new ApiError(400, "Category name is required");
  }
  const slug = slugify(name);
  const existing = await Category.findOne({ where: { slug } });
  if (existing) {
    throw new ApiError(400, "A category with this name already exists");
  }
  if (parentId) {
    const parent = await Category.findByPk(parentId);
    if (!parent) {
      throw new ApiError(400, "Parent category not found");
    }
  }
  return Category.create({
    name,
    slug,
    description,
    image,
    parentId: parentId || null,
  });
};

export const updateCategory = async (id, { name, description, image, parentId, isActive }) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  if (name && name !== category.name) {
    const slug = slugify(name);
    const existing = await Category.findOne({ where: { slug } });
    if (existing && existing.id !== category.id) {
      throw new ApiError(400, "A category with this name already exists");
    }
    category.name = name;
    category.slug = slug;
  }
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined) category.isActive = isActive;
  if (parentId !== undefined) {
    if (Number(parentId) === category.id) {
      throw new ApiError(400, "A category cannot be its own parent");
    }
    category.parentId = parentId || null;
  }
  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  await category.destroy();
  return { message: "Category deleted successfully" };
};