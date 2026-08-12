import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const CartItem = sequelizeInstance.define(
    "CartItem",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cartId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        references: {
          model: "Carts",
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
      quantity: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "CartItems",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["cartId", "productId"], // no duplicate rows for the same product
        },
      ],
    }
  );

  CartItem.associate = (models) => {
    if (models.Cart) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: "cartId",
        as: "cart",
      });
    }
    if (models.Product) {
      CartItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  };

  return CartItem;
};