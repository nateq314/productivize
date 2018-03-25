exports.up = function(knex, Promise) {
  return knex.schema.createTable("todos", table => {
    table
      .increments("id")
      .unsigned()
      .primary();
    table
      .integer("user_id")
      .unsigned()
      .references("users.id")
      .notNullable();
    table
      .boolean("important")
      .notNullable()
      .defaultTo(false);
    table
      .string("content")
      .notNullable()
      .defaultTo("");
    table.dateTime("completedOn");
    table.timestamps(false, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("todos");
};
