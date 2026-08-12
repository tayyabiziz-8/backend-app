import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const Cart = sequelizeInstance.define(
    "Cart",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        unique: true, // one cart per user
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Carts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Cart.associate = (models) => {
    if (models.User) {
      Cart.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
    if (models.CartItem) {
      Cart.hasMany(models.CartItem, {
        foreignKey: "cartId",
        as: "items",
      });
    }
  };

  return Cart;
};