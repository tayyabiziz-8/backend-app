"use strict";
import dotenv from "dotenv/config.js";

import { Sequelize } from "sequelize";

import UserFactory from "./user.js";
import UserAuthTokenFactory from "./user_auth_token.js";

/**
 * Single shared Sequelize instance. Exported eagerly so any model file that
 * does `import { sequelize } from "./index.js"` (for default-arg fallbacks)
 * resolves the live binding correctly even with circular imports.
 */
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    logging: false,
  }
);

/**
 * Synchronously instantiate every model so `db` is fully populated by the
 * time other modules import it. This replaces the older async-IIFE pattern,
 * which left `db` empty for any synchronous consumer and forced controllers
 * to re-run factories + manually re-define associations.
 */
const User = UserFactory(sequelize, Sequelize);
const UserAuthToken = UserAuthTokenFactory(sequelize, Sequelize);

const db = {
  User,
  UserAuthToken,
};

/**
 * Wire every model's associations once, against the shared `db` registry.
 * Each model file declares its relations inside `Model.associate = (models) => {...}`,
 * so consumers never need to redefine them in controllers/services.
 */
Object.values(db).forEach((model) => {
  if (typeof model?.associate === "function") {
    model.associate(db);
  }
});

export {
  db,
  sequelize,
  Sequelize,
  User,
  UserAuthToken,
};
