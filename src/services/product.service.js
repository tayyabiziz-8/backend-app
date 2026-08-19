import { Op } from "sequelize";
import { Product, Category } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

const slugify = (str) =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const listProducts = async ({ categoryId, search, page = 1, limit = 20 } = {}) => {
  const where = { isActive: true };
  if (categoryId) where.categoryId = categoryId;
  if (search) where.name = { [Op.iLike]: `%${search}%` };

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
    order: [["id", "ASC"]],
    limit: Number(limit),
    offset,
  });

  return {
    products: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
  });
  if (!product) {
    throw new ApiError(404, `Product with id: ${id} not found`);
  }
  return product;
};

export const createProduct = async ({
  name,
  description,
  price,
  discountPrice,
  sku,
  stock,
  images,
  categoryId,
}) => {
  if (!name || price === undefined) {
    throw new ApiError(400, "Product name and price are required");
  }

  const slug = slugify(name);
  const existing = await Product.findOne({ where: { slug } });
  if (existing) {
    throw new ApiError(400, "A product with this name already exists");
  }

  if (categoryId) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new ApiError(400, "Category not found");
    }
  }

  return Product.create({
    name,
    slug,
    description,
    price,
    discountPrice,
    sku,
    stock: stock ?? 0,
    images: images ?? [],
    categoryId: categoryId || null,
  });
};

export const updateProduct = async (id, updates) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const {
    name,
    description,
    price,
    discountPrice,
    sku,
    stock,
    images,
    categoryId,
    isActive,
  } = updates;

  if (name && name !== product.name) {
    const slug = slugify(name);
    const existing = await Product.findOne({ where: { slug } });
    if (existing && existing.id !== product.id) {
      throw new ApiError(400, "A product with this name already exists");
    }
    product.name = name;
    product.slug = slug;
  }

  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (discountPrice !== undefined) product.discountPrice = discountPrice;
  if (sku !== undefined) product.sku = sku;
  if (stock !== undefined) product.stock = stock;
  if (images !== undefined) product.images = images;
  if (isActive !== undefined) product.isActive = isActive;
  if (categoryId !== undefined) {
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new ApiError(400, "Category not found");
      }
    }
    product.categoryId = categoryId || null;
  }

  await product.save();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  await product.destroy();
  return { message: "Product deleted successfully" };
};