require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_DATABASE || "backend-psql",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres"
  },
  staging: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_DATABASE || "backend-psql",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres"
  }
};