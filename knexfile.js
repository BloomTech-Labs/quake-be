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

  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations",
  },
  seeds: {
      directory: "./data/seeds",
  },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations",
  },
  seeds: {
      directory: "./data/seeds",
  },
  }

};
