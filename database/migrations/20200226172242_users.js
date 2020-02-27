
exports.up = function(knex) {
  return knex.schema.createTable("users", users => {
      users.increments();

      users
      .string("username", 255)
      .notNullable()
      .unique();

      users
      .string("password", 255)
      .notNullable();

      users
      .string("userID", 255)

      users
      .integer("zipcode")

      users
      .integer("loginCount")

      users
      .string("email address", 255)
      .notNullable();

      users
      .string("first name", 255)
      .notNullable()

      users
      .string("last name", 255)
      .notNullable()

      users
      .string("phone number", 255)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
