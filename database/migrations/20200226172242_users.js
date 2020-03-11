
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
      .integer("zipcode")

      users
      .integer("loginCount")

      users
      .string("emailAddress", 255)
      .notNullable();

      users
      .string("firstName", 255)
      .notNullable()

      users
      .string("lastName", 255)
      .notNullable()

      users
      .string("phoneNumber", 255)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
