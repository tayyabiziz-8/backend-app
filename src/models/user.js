import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const User = sequelizeInstance.define(
    "User",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypesInstance.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypesInstance.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      profilePicture: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      }
    },
    {
      tableName: "Users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["firstName"],
        },
        {
          fields: ["lastName"],
        },
        {
          fields: ["phone"],
        }
      ],
    }
  );
  User.associate = (models) => {
    if (models.UserAuthToken) {
      User.hasMany(models.UserAuthToken, {
        foreignKey: "userId",
        as: "authTokens",
      });
    }
  };
  return User;
};