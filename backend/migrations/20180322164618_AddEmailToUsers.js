exports.up = function(knex, Promise) {
  return knex.schema.table("users", table => {
    table.string("email");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", table => {
    table.dropColumn("email");
  });
};
