exports.up = function(knex, Promise) {
  return knex.schema.table("users", table => {
    table.unique("email");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", table => {
    table.dropUnique("email");
  });
};
