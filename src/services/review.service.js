import { Review, User, Product, sequelize } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export const listReviewsForProduct = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const reviews = await Review.findAll({
    where: { productId },
    include: [{ model: User, as: "user", attributes: ["id", "firstName", "lastName"] }],
    order: [["created_at", "DESC"]],
  });

  const summary = await Review.findOne({
    where: { productId },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
      [sequelize.fn("COUNT", sequelize.col("id")), "reviewCount"],
    ],
    raw: true,
  });

  return {
    reviews,
    averageRating: summary?.averageRating ? Number(summary.averageRating).toFixed(1) : null,
    reviewCount: Number(summary?.reviewCount || 0),
  };
};

export const createReview = async (userId, { productId, rating, comment }) => {
  if (!productId || rating === undefined) {
    throw new ApiError(400, "productId and rating are required");
  }
  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existing = await Review.findOne({ where: { userId, productId } });
  if (existing) {
    throw new ApiError(400, "You've already reviewed this product");
  }
  return Review.create({ userId, productId, rating, comment });
};

export const updateReview = async (userId, reviewId, { rating, comment }) => {
  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }
  if (review.userId !== userId) {
    throw new ApiError(403, "You can only edit your own review");
  }
  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }
    review.rating = rating;
  }
  if (comment !== undefined) review.comment = comment;
  await review.save();
  return review;
};

export const deleteReview = async (userId, reviewId) => {
  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }
  if (review.userId !== userId) {
    throw new ApiError(403, "You can only delete your own review");
  }
  await review.destroy();
  return { message: "Review deleted successfully" };
};