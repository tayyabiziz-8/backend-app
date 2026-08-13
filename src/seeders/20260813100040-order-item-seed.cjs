"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [orders] = await queryInterface.sequelize.query(
      `SELECT id FROM "Orders" ORDER BY id ASC;`
    );
    const [products] = await queryInterface.sequelize.query(
      `SELECT id, price FROM "Products" ORDER BY id ASC;`
    );

    if (!orders.length || !products.length) {
      console.log(
        "No orders or products found - skipping OrderItems seed. Seed Orders and Products first."
      );
      return;
    }

    const rows = [];
    orders.forEach((order, i) => {
      const p1 = products[i % products.length];
      const p2 = products[(i + 1) % products.length];

      rows.push({
        orderId: order.id,
        productId: p1.id,
        quantity: 1,
        price: p1.price,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (p2.id !== p1.id) {
        rows.push({
          orderId: order.id,
          productId: p2.id,
          quantity: 2,
          price: p2.price,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert("OrderItems", rows);

    // Recalculate each order's totalAmount from its actual line items,
    // rather than leaving the Orders seeder's placeholder value of 0.
    await queryInterface.sequelize.query(`
      UPDATE "Orders" o
      SET "totalAmount" = sub.total
      FROM (
        SELECT "orderId", SUM(quantity * price) AS total
        FROM "OrderItems"
        GROUP BY "orderId"
      ) sub
      WHERE o.id = sub."orderId";
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrderItems", null, {});
  },
};
