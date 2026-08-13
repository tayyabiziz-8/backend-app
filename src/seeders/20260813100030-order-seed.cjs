"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC LIMIT 3;`
    );

    if (!users.length) {
      console.log("No users found - skipping Orders seed. Seed Users first.");
      return;
    }

    const statuses = ["pending", "processing", "delivered"];
    const paymentStatuses = ["pending", "pending", "paid"];

    const rows = users.map((user, i) => ({
      userId: user.id,
      status: statuses[i % statuses.length],
      // Placeholder - the OrderItems seeder recalculates this from actual
      // line items once it runs.
      totalAmount: 0,
      shippingAddress: `${100 + i} Example Street, Sample City, 0000${i}`,
      paymentMethod: "card",
      paymentStatus: paymentStatuses[i % paymentStatuses.length],
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("Orders", rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
