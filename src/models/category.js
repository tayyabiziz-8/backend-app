import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const Category = sequelizeInstance.define(
    "Category",
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
      image: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      // Self-referencing FK. NULL = top-level category, set = sub-category.
      parentId: {
        type: DataTypesInstance.INTEGER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      isActive: {
        type: DataTypesInstance.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "Categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["slug"],
        },
        {
          fields: ["parentId"],
        },
      ],
    }
  );

  Category.associate = (models) => {
    // Sub-categories / parent (self-referencing)
    Category.hasMany(Category, {
      as: "subCategories",
      foreignKey: "parentId",
    });
    Category.belongsTo(Category, {
      as: "parent",
      foreignKey: "parentId",
    });

    if (models.Product) {
      Category.hasMany(models.Product, {
        foreignKey: "categoryId",
        as: "products",
      });
    }
  };

  return Category;
};