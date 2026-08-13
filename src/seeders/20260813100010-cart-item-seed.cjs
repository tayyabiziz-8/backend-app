"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [carts] = await queryInterface.sequelize.query(
      `SELECT id FROM "Carts" ORDER BY id ASC;`
    );
    const [products] = await queryInterface.sequelize.query(
      `SELECT id FROM "Products" ORDER BY id ASC;`
    );

    if (!carts.length || !products.length) {
      console.log(
        "No carts or products found - skipping CartItems seed. Seed Carts and Products first."
      );
      return;
    }

    const rows = [];
    carts.forEach((cart, i) => {
      const p1 = products[i % products.length];
      const p2 = products[(i + 1) % products.length];

      rows.push({
        cartId: cart.id,
        productId: p1.id,
        quantity: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (p2.id !== p1.id) {
        rows.push({
          cartId: cart.id,
          productId: p2.id,
          quantity: 2,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    // ignoreDuplicates handles the unique (cartId, productId) constraint
    // if this is re-run against carts that already have these items.
    await queryInterface.bulkInsert("CartItems", rows, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("CartItems", null, {});
  },
};
