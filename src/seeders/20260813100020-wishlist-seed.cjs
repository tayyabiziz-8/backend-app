"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC;`
    );
    const [products] = await queryInterface.sequelize.query(
      `SELECT id FROM "Products" ORDER BY id ASC;`
    );

    if (!users.length || !products.length) {
      console.log(
        "No users or products found - skipping Wishlists seed. Seed Users and Products first."
      );
      return;
    }

    const rows = users.map((user, i) => ({
      userId: user.id,
      productId: products[i % products.length].id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // ignoreDuplicates handles the unique (userId, productId) constraint.
    await queryInterface.bulkInsert("Wishlists", rows, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Wishlists", null, {});
  },
};