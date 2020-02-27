const db = require("../database/dbConfig.js");

const find = () => {
  return db("users");
};

const findBy = filter => {
  return db("users").where(filter);
};

const findById = id => {
  return db("users")
    .where({ id })
    .first();
};

const add = async user => {
  const [id] = await db("users").insert(user, "id");
  return db("users")
    .where({ id })
    .first();
};



const remove = id => {
  return db("users")
    .where({ id })
    .del();
};

module.exports = {
  find,
  findBy,
  findById,
  add,
  remove
};
