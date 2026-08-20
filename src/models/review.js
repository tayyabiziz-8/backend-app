import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const Review = sequelizeInstance.define(
    "Review",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      productId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        references: { model: "Products", key: "id" },
        onDelete: "CASCADE",
      },
      rating: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypesInstance.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Reviews",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["productId"] },
        { unique: true, fields: ["userId", "productId"] },
      ],
    }
  );
  Review.associate = (models) => {
    if (models.User) {
      Review.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
    if (models.Product) {
      Review.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
    }
  };
  return Review;
};