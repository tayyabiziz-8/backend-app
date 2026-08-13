"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Top-level categories first
    await queryInterface.bulkInsert(
      "Categories",
      [
      {
        name: "Electronics",
        slug: "electronics",
        description: "Phones, computers, and accessories.",
        image: null,
        parentId: null,
        isActive: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Everything for the home.",
        image: null,
        parentId: null,
        isActive: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { ignoreDuplicates: true });

    // Look up the parent IDs we just created so we can attach sub-categories
    const [parents] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM "Categories" WHERE slug IN ('electronics', 'home-kitchen');`
    );
    const electronicsId = parents.find((p) => p.slug === "electronics")?.id;

    if (electronicsId) {
      await queryInterface.bulkInsert("Categories", [
        {
          name: "Computers",
          slug: "computers",
          description: "Laptops, desktops, and parts.",
          image: null,
          parentId: electronicsId,
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Accessories",
          slug: "accessories",
          description: "Cables, mice, keyboards, and more.",
          image: null,
          parentId: electronicsId,
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ], { ignoreDuplicates: true });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", {
      slug: ["electronics", "home-kitchen", "computers", "accessories"],
    });
  },
};
