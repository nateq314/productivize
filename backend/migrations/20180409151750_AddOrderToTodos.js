exports.up = function(knex, Promise) {
  return knex.schema.table("todos", todos => {
    todos.integer("order");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("todos", todos => {
    todos.dropColumn("order");
  });
};
