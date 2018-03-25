exports.up = function(knex, Promise) {
  return knex.schema.alterTable("users", table => {
    table
      .datetime("created_at")
      .defaultTo(knex.fn.now())
      .alter();
    table
      .datetime("updated_at")
      .defaultTo(knex.fn.now())
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("users", table => {
    table.datetime("created_at").alter();
    table.datetime("updated_at").alter();
  });
};
