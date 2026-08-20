"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        { name: "Electronics", slug: "electronics", description: "Phones, computers, and accessories.", image: null, parentId: null, isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Home & Kitchen", slug: "home-kitchen", description: "Everything for the home.", image: null, parentId: null, isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Clothing", slug: "clothing", description: "Apparel for everyone.", image: null, parentId: null, isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Books", slug: "books", description: "Fiction, non-fiction, and guides.", image: null, parentId: null, isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Sports & Outdoors", slug: "sports-outdoors", description: "Gear for staying active.", image: null, parentId: null, isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Skincare, haircare, and wellness.", image: null, parentId: null, isActive: true, created_at: new Date(), updated_at: new Date() },
      ],
      { ignoreDuplicates: true }
    );

    const [parents] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM "Categories" WHERE slug IN ('electronics', 'home-kitchen', 'clothing', 'sports-outdoors');`
    );
    const idOf = (slug) => parents.find((p) => p.slug === slug)?.id ?? null;

    await queryInterface.bulkInsert(
      "Categories",
      [
        { name: "Computers", slug: "computers", description: "Laptops, desktops, and parts.", image: null, parentId: idOf("electronics"), isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Accessories", slug: "accessories", description: "Cables, mice, keyboards, and more.", image: null, parentId: idOf("electronics"), isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Kitchen Appliances", slug: "kitchen-appliances", description: "Mixers, machines, and more.", image: null, parentId: idOf("home-kitchen"), isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Furniture", slug: "furniture", description: "Chairs, desks, and storage.", image: null, parentId: idOf("home-kitchen"), isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Men's Clothing", slug: "mens-clothing", description: "Apparel for men.", image: null, parentId: idOf("clothing"), isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Women's Clothing", slug: "womens-clothing", description: "Apparel for women.", image: null, parentId: idOf("clothing"), isActive: true, created_at: new Date(), updated_at: new Date() },
        { name: "Fitness Equipment", slug: "fitness-equipment", description: "Home workout gear.", image: null, parentId: idOf("sports-outdoors"), isActive: true, created_at: new Date(), updated_at: new Date() },
      ],
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", {
      slug: [
        "electronics", "home-kitchen", "clothing", "books", "sports-outdoors", "beauty-personal-care",
        "computers", "accessories", "kitchen-appliances", "furniture",
        "mens-clothing", "womens-clothing", "fitness-equipment",
      ],
    });
  },
};