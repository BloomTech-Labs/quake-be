// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true, // needed for sqlite
    connection: {
      filename: './data/activity.db3'
    },
    migrations: {
      directory: "./data/migrations",
  },
  seeds: {
      directory: "./data/seeds",
  },
  },
  testing: {
    client: "sqlite3",
    connection: {
      filename: "./data/test.db3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },

  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./data/migrations",
  },
  seeds: {
      directory: "./data/seeds",
  },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./data/migrations",
  },
  seeds: {
      directory: "./data/seeds",
  },
  }

};
