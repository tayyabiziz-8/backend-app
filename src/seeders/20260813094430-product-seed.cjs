"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [categories] = await queryInterface.sequelize.query(`SELECT id, slug FROM "Categories";`);
    const catId = (slug) => categories.find((c) => c.slug === slug)?.id ?? null;
    const now = new Date();
    const img = (name) => JSON.stringify([`https://example.com/images/${name}.jpg`]);

    const products = [
      // Accessories
      { name: "Wireless Mouse", slug: "wireless-mouse", description: "Ergonomic wireless mouse with USB receiver.", price: 19.99, discountPrice: 14.99, sku: "SKU-WM-001", stock: 120, images: img("wireless-mouse-1"), categoryId: catId("accessories"), isActive: true },
      { name: "Mechanical Keyboard", slug: "mechanical-keyboard", description: "RGB backlit mechanical keyboard with blue switches.", price: 59.99, discountPrice: null, sku: "SKU-MK-002", stock: 75, images: img("mechanical-keyboard-1"), categoryId: catId("accessories"), isActive: true },
      { name: "USB-C Hub", slug: "usb-c-hub", description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots.", price: 34.5, discountPrice: 29.99, sku: "SKU-UCH-003", stock: 200, images: img("usb-c-hub-1"), categoryId: catId("accessories"), isActive: true },
      { name: "1080p Webcam", slug: "1080p-webcam", description: "Full HD webcam with built-in noise-cancelling mic.", price: 44.0, discountPrice: null, sku: "SKU-WC-004", stock: 0, images: img("webcam-1"), categoryId: catId("accessories"), isActive: false },
      { name: "Laptop Backpack", slug: "laptop-backpack", description: "Water-resistant backpack with padded 15\" laptop sleeve.", price: 42.0, discountPrice: 36.0, sku: "SKU-LB-005", stock: 90, images: img("laptop-backpack-1"), categoryId: catId("accessories"), isActive: true },
      // Computers
      { name: "Laptop Pro 15\"", slug: "laptop-pro-15", description: "15-inch laptop with 16GB RAM and 512GB SSD.", price: 1299.0, discountPrice: 1199.0, sku: "SKU-LP-006", stock: 25, images: img("laptop-pro-1"), categoryId: catId("computers"), isActive: true },
      { name: "Gaming Desktop Tower", slug: "gaming-desktop-tower", description: "Pre-built gaming PC with dedicated GPU.", price: 1599.0, discountPrice: null, sku: "SKU-GD-007", stock: 12, images: img("gaming-desktop-1"), categoryId: catId("computers"), isActive: true },
      { name: "27\" 4K Monitor", slug: "27-inch-4k-monitor", description: "27-inch 4K UHD IPS monitor with USB-C input.", price: 379.99, discountPrice: 329.99, sku: "SKU-MON-008", stock: 40, images: img("4k-monitor-1"), categoryId: catId("computers"), isActive: true },
      // Kitchen Appliances
      { name: "Stand Mixer", slug: "stand-mixer", description: "5-quart stand mixer with dough hook and whisk attachments.", price: 249.99, discountPrice: 219.99, sku: "SKU-SM-009", stock: 30, images: img("stand-mixer-1"), categoryId: catId("kitchen-appliances"), isActive: true },
      { name: "Espresso Machine", slug: "espresso-machine", description: "15-bar pump espresso machine with milk frother.", price: 189.0, discountPrice: null, sku: "SKU-EM-010", stock: 18, images: img("espresso-machine-1"), categoryId: catId("kitchen-appliances"), isActive: true },
      { name: "Air Fryer", slug: "air-fryer", description: "5.8-quart digital air fryer with 8 presets.", price: 89.99, discountPrice: 74.99, sku: "SKU-AF-011", stock: 60, images: img("air-fryer-1"), categoryId: catId("kitchen-appliances"), isActive: true },
      // Furniture
      { name: "Ergonomic Office Chair", slug: "ergonomic-office-chair", description: "Mesh-back office chair with lumbar support.", price: 219.0, discountPrice: 189.0, sku: "SKU-OC-012", stock: 22, images: img("office-chair-1"), categoryId: catId("furniture"), isActive: true },
      { name: "Adjustable Standing Desk", slug: "adjustable-standing-desk", description: "Electric height-adjustable desk, 48x24 inches.", price: 349.0, discountPrice: null, sku: "SKU-SD-013", stock: 15, images: img("standing-desk-1"), categoryId: catId("furniture"), isActive: true },
      // Men's Clothing
      { name: "Men's Cotton T-Shirt", slug: "mens-cotton-tshirt", description: "Classic-fit 100% cotton crew neck tee.", price: 14.99, discountPrice: null, sku: "SKU-MT-014", stock: 300, images: img("mens-tshirt-1"), categoryId: catId("mens-clothing"), isActive: true },
      { name: "Men's Denim Jacket", slug: "mens-denim-jacket", description: "Classic trucker-style denim jacket.", price: 64.99, discountPrice: 54.99, sku: "SKU-MJ-015", stock: 45, images: img("mens-jacket-1"), categoryId: catId("mens-clothing"), isActive: true },
      { name: "Men's Running Shoes", slug: "mens-running-shoes", description: "Lightweight breathable running shoes.", price: 79.99, discountPrice: null, sku: "SKU-MS-016", stock: 85, images: img("mens-shoes-1"), categoryId: catId("mens-clothing"), isActive: true },
      // Women's Clothing
      { name: "Women's Yoga Leggings", slug: "womens-yoga-leggings", description: "High-waisted stretch leggings with side pocket.", price: 29.99, discountPrice: 24.99, sku: "SKU-WL-017", stock: 150, images: img("womens-leggings-1"), categoryId: catId("womens-clothing"), isActive: true },
      { name: "Women's Wool Sweater", slug: "womens-wool-sweater", description: "Soft merino wool blend crewneck sweater.", price: 54.99, discountPrice: null, sku: "SKU-WS-018", stock: 55, images: img("womens-sweater-1"), categoryId: catId("womens-clothing"), isActive: true },
      { name: "Women's Sneakers", slug: "womens-sneakers", description: "Casual low-top sneakers with memory foam insole.", price: 49.99, discountPrice: 39.99, sku: "SKU-WSN-019", stock: 70, images: img("womens-sneakers-1"), categoryId: catId("womens-clothing"), isActive: true },
      // Fitness Equipment
      { name: "Adjustable Dumbbell Set", slug: "adjustable-dumbbell-set", description: "5-52.5 lb adjustable dumbbells, pair.", price: 299.0, discountPrice: 259.0, sku: "SKU-DB-020", stock: 10, images: img("dumbbell-set-1"), categoryId: catId("fitness-equipment"), isActive: true },
      { name: "Yoga Mat", slug: "yoga-mat", description: "6mm non-slip TPE yoga mat with carry strap.", price: 24.99, discountPrice: null, sku: "SKU-YM-021", stock: 200, images: img("yoga-mat-1"), categoryId: catId("fitness-equipment"), isActive: true },
      { name: "Resistance Bands Set", slug: "resistance-bands-set", description: "5-piece resistance band set with door anchor.", price: 19.99, discountPrice: 15.99, sku: "SKU-RB-022", stock: 0, images: img("resistance-bands-1"), categoryId: catId("fitness-equipment"), isActive: true },
      // Books (direct, no subcategory)
      { name: "The Productivity Blueprint", slug: "the-productivity-blueprint", description: "A practical guide to focused, effective work.", price: 16.99, discountPrice: null, sku: "SKU-BK-023", stock: 130, images: img("book-productivity-1"), categoryId: catId("books"), isActive: true },
      { name: "Modern Web Development Guide", slug: "modern-web-development-guide", description: "A hands-on introduction to building for the web.", price: 34.99, discountPrice: 29.99, sku: "SKU-BK-024", stock: 65, images: img("book-webdev-1"), categoryId: catId("books"), isActive: true },
      { name: "Mindful Living Journal", slug: "mindful-living-journal", description: "Guided daily journal for reflection and gratitude.", price: 12.99, discountPrice: null, sku: "SKU-BK-025", stock: 180, images: img("book-journal-1"), categoryId: catId("books"), isActive: true },
      // Beauty & Personal Care (direct)
      { name: "Vitamin C Serum", slug: "vitamin-c-serum", description: "Brightening facial serum with 15% vitamin C.", price: 22.99, discountPrice: 18.99, sku: "SKU-BC-026", stock: 110, images: img("vitamin-c-serum-1"), categoryId: catId("beauty-personal-care"), isActive: true },
      { name: "Hydrating Face Moisturizer", slug: "hydrating-face-moisturizer", description: "Daily lightweight moisturizer for all skin types.", price: 18.99, discountPrice: null, sku: "SKU-BC-027", stock: 140, images: img("moisturizer-1"), categoryId: catId("beauty-personal-care"), isActive: true },
      { name: "Bamboo Toothbrush Set", slug: "bamboo-toothbrush-set", description: "4-pack biodegradable bamboo toothbrushes.", price: 9.99, discountPrice: 7.99, sku: "SKU-BC-028", stock: 250, images: img("toothbrush-set-1"), categoryId: catId("beauty-personal-care"), isActive: true },
    ].map((p) => ({ ...p, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert("Products", products, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", {
      sku: [
        "SKU-WM-001", "SKU-MK-002", "SKU-UCH-003", "SKU-WC-004", "SKU-LB-005",
        "SKU-LP-006", "SKU-GD-007", "SKU-MON-008", "SKU-SM-009", "SKU-EM-010",
        "SKU-AF-011", "SKU-OC-012", "SKU-SD-013", "SKU-MT-014", "SKU-MJ-015",
        "SKU-MS-016", "SKU-WL-017", "SKU-WS-018", "SKU-WSN-019", "SKU-DB-020",
        "SKU-YM-021", "SKU-RB-022", "SKU-BK-023", "SKU-BK-024", "SKU-BK-025",
        "SKU-BC-026", "SKU-BC-027", "SKU-BC-028",
      ],
    });
  },
};