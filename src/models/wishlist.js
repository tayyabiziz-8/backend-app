import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const Wishlist = sequelizeInstance.define(
    "Wishlist",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      productId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Wishlists",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["userId", "productId"], // can't wishlist the same product twice
        },
      ],
    }
  );
  Wishlist.associate = (models) => {
    if (models.User) {
      Wishlist.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
    if (models.Product) {
      Wishlist.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  };
  return Wishlist;
};