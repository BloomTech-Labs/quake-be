require('dotenv').config();

module.exports = {
  development: {
    client: 'sqlite3',
    //This was updated with DB for Heroku
    connection: { filename: './database/users.db3' },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },
//This part is done w POSTGRES
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },
};