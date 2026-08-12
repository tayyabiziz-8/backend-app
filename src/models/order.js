import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const Order = sequelizeInstance.define(
    "Order",
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
      status: {
        type: DataTypesInstance.ENUM(
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      totalAmount: {
        type: DataTypesInstance.DECIMAL(10, 2),
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypesInstance.TEXT,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      paymentStatus: {
        type: DataTypesInstance.ENUM("pending", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "Orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["status"],
        },
      ],
    }
  );
  Order.associate = (models) => {
    if (models.User) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
    if (models.OrderItem) {
      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "items",
      });
    }
  };
  return Order;
};