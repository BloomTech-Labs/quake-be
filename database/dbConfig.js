const knex = require("knex");

const knexConfig = require("../knexfile.js");

const dbEnv = process.env.DB_ENV || "development";

//const dbConnection = process.env.DATABASE_URL

module.exports = knex(knexConfig[dbEnv]);
