exports.up = function(knex, Promise) {
  return knex.schema.table("users", users => {
    users.string("phone_number");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", users => {
    users.dropColumn("phone_number");
  });
};
