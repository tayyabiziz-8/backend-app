"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'user' ORDER BY id ASC;`
    );
    const [products] = await queryInterface.sequelize.query(
      `SELECT id FROM "Products" WHERE "isActive" = true ORDER BY id ASC;`
    );

    if (!users.length || !products.length) {
      console.log("No users or active products found - skipping Reviews seed.");
      return;
    }

    const comments = [
      "Exactly what I needed, works great.",
      "Good value for the price.",
      "Quality feels premium, happy with this purchase.",
      "Does the job, no complaints.",
      "Shipping was fast and packaging was solid.",
      "A bit smaller than expected but still good.",
      "Would buy again.",
      "Not bad, but I've seen better for the price.",
    ];
    const ratings = [5, 4, 5, 3, 4, 5, 2, 4];

    const seen = new Set();
    const rows = [];
    users.forEach((user, ui) => {
      for (let j = 0; j < 3; j++) {
        const product = products[(ui * 3 + j) % products.length];
        const key = `${user.id}-${product.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const idx = (ui * 3 + j) % comments.length;
        rows.push({
          userId: user.id,
          productId: product.id,
          rating: ratings[idx],
          comment: comments[idx],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert("Reviews", rows, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reviews", null, {});
  },
};