"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC;`
    );

    if (!users.length) {
      console.log("No users found - skipping Carts seed. Seed Users first.");
      return;
    }

    const rows = users.map((user) => ({
      userId: user.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // ignoreDuplicates so re-running this after Carts already exist
    // (unique on userId) doesn't blow up.
    await queryInterface.bulkInsert("Carts", rows, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    // Dev seeder - clears every cart. Fine for local/test resets.
    await queryInterface.bulkDelete("Carts", null, {});
  },
};