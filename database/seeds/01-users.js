const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
  
    // Deletes ALL existing entries
    return knex('user')
    .del()
      .then(function () {
        // Inserts seed entries
        return knex('user').insert([
          {
            username: 'BOT101',
            password: bcrypt.hashSync("Password350", 12)
          },
          { 
            username: 'BOT203',
            password: bcrypt.hashSync("Password370", 12)
          },
          {
            username: 'BOT204',
            password: bcrypt.hashSync("Password360", 12)
          },
        ]);
      });
  };