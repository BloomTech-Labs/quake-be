require('dotenv').config();
module.exports = {
  development: {
    client: 'sqlite3',
    //This was updated with DB for Heroku
    connection: { filename: './data/auth.db3' },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
  },
//This part is done w POSTGRES
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
  },
};