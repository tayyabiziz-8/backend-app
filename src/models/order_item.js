import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const OrderItem = sequelizeInstance.define(
    "OrderItem",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
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
        onDelete: "RESTRICT", // keep order history intact even if product mgmt changes
      },
      quantity: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      // Snapshot of the product price at the time of purchase -
      // product.price can change later without rewriting order history.
      price: {
        type: DataTypesInstance.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "OrderItems",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["orderId"],
        },
        {
          fields: ["productId"],
        },
      ],
    }
  );

  OrderItem.associate = (models) => {
    if (models.Order) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
    if (models.Product) {
      OrderItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  };

  return OrderItem;
};