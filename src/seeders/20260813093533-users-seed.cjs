"use strict";

const saltRounds = 10;
const hashPassword = (password) => {
  const bcrypt = require("bcrypt");
  return bcrypt.hashSync(password, saltRounds);
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require("bcrypt");
    const emails = [
      "admin@gmail.com",
      "user@gmail.com",
      "alice@example.com",
      "bob@example.com",
      "carol@example.com",
      "david@example.com",
      "emma@example.com",
    ];
    await queryInterface.bulkDelete("Users", { email: emails }, {});

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Super",
          lastName: "Admin",
          email: "admin@gmail.com",
          password: hashPassword("admin123"),
          role: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          firstName: "Regular",
          lastName: "User",
          email: "user@gmail.com",
          password: hashPassword("user123"),
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice@example.com",
          password: hashPassword("password123"),
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          firstName: "Bob",
          lastName: "Smith",
          email: "bob@example.com",
          password: hashPassword("password123"),
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          firstName: "Carol",
          lastName: "White",
          email: "carol@example.com",
          password: hashPassword("password123"),
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          firstName: "David",
          lastName: "Brown",
          email: "david@example.com",
          password: hashPassword("password123"),
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          firstName: "Emma",
          lastName: "Davis",
          email: "emma@example.com",
          password: hashPassword("password123"),
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};