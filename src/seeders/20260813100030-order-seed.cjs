"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'user' ORDER BY id ASC;`
    );

    if (!users.length) {
      console.log("No users found - skipping Orders seed. Seed Users first.");
      return;
    }

    const statuses = ["pending", "processing", "shipped", "delivered", "delivered", "cancelled"];
    const paymentStatuses = ["pending", "pending", "paid", "paid", "paid", "refunded"];

    const rows = [];
    users.forEach((user, i) => {
      // give most users 1 order, a couple of them 2, for order-history variety
      const orderCount = i % 3 === 0 ? 2 : 1;
      for (let j = 0; j < orderCount; j++) {
        const idx = (i + j) % statuses.length;
        rows.push({
          userId: user.id,
          status: statuses[idx],
          // Placeholder - the OrderItems seeder recalculates this from actual line items.
          totalAmount: 0,
          shippingAddress: `${100 + i * 10 + j} Example Street, Sample City, ${10000 + i}`,
          paymentMethod: j % 2 === 0 ? "card" : "cash_on_delivery",
          paymentStatus: paymentStatuses[idx],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert("Orders", rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};