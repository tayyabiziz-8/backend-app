import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const Product = sequelizeInstance.define(
    "Product",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypesInstance.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypesInstance.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypesInstance.DECIMAL(10, 2),
        allowNull: false,
      },
      discountPrice: {
        type: DataTypesInstance.DECIMAL(10, 2),
        allowNull: true,
      },
      sku: {
        type: DataTypesInstance.STRING,
        allowNull: true,
        unique: true,
      },
      stock: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      images: {
        type: DataTypesInstance.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      categoryId: {
        type: DataTypesInstance.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      isActive: {
        type: DataTypesInstance.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "Products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["slug"],
        },
        {
          unique: true,
          fields: ["sku"],
        },
        {
          fields: ["categoryId"],
        },
      ],
    }
  );
  Product.associate = (models) => {
    if (models.Category) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
    if (models.CartItem) {
      Product.hasMany(models.CartItem, {
        foreignKey: "productId",
        as: "cartItems",
      });
    }
    if (models.Wishlist) {
      Product.hasMany(models.Wishlist, {
        foreignKey: "productId",
        as: "wishlistedBy",
      });
    }
    if (models.OrderItem) {
      Product.hasMany(models.OrderItem, {
        foreignKey: "productId",
        as: "orderItems",
      });
    }
    if (models.Review) {
      Product.hasMany(models.Review, { foreignKey: "productId", as: "reviews" });
    }
  };
  return Product;
};