import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import User from "./user.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const UserAuthToken = sequelizeInstance.define(
    "UserAuthToken",
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
          model: User,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      token: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "user_auth_token",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  UserAuthToken.associate = (models) => {
    if (models.User) {
      UserAuthToken.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  };
  return UserAuthToken;
};
