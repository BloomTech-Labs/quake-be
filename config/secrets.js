// enviroment export just in case
require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || "quake"
};
