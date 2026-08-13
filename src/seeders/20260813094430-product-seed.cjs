"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Grab an existing category to attach products to, if one exists.
    // Falls back to null (Products.categoryId is nullable) if Categories is empty.
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id FROM "Categories" ORDER BY id ASC LIMIT 1;`
    );
    const categoryId = categories.length ? categories[0].id : null;

    await queryInterface.bulkInsert("Products", [
      {
        name: "Wireless Mouse",
        slug: "wireless-mouse",
        description: "Ergonomic wireless mouse with USB receiver.",
        price: 19.99,
        discountPrice: 14.99,
        sku: "SKU-WM-001",
        stock: 120,
        images: JSON.stringify([
          "https://example.com/images/wireless-mouse-1.jpg",
        ]),
        categoryId,
        isActive: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mechanical Keyboard",
        slug: "mechanical-keyboard",
        description: "RGB backlit mechanical keyboard with blue switches.",
        price: 59.99,
        discountPrice: null,
        sku: "SKU-MK-002",
        stock: 75,
        images: JSON.stringify([
          "https://example.com/images/mechanical-keyboard-1.jpg",
          "https://example.com/images/mechanical-keyboard-2.jpg",
        ]),
        categoryId,
        isActive: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "USB-C Hub",
        slug: "usb-c-hub",
        description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots.",
        price: 34.5,
        discountPrice: 29.99,
        sku: "SKU-UCH-003",
        stock: 200,
        images: JSON.stringify(["https://example.com/images/usb-c-hub-1.jpg"]),
        categoryId,
        isActive: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "1080p Webcam",
        slug: "1080p-webcam",
        description: "Full HD webcam with built-in noise-cancelling mic.",
        price: 44.0,
        discountPrice: null,
        sku: "SKU-WC-004",
        stock: 0,
        images: JSON.stringify(["https://example.com/images/webcam-1.jpg"]),
        categoryId,
        isActive: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", {
      sku: ["SKU-WM-001", "SKU-MK-002", "SKU-UCH-003", "SKU-WC-004"],
    });
  },
};
