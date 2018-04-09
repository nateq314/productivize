exports.up = function(knex, Promise) {
  return knex.schema.table("todos", todos => {
    todos.string("description");
    todos.dateTime("deadline");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("todos", todos => {
    todos.dropColumn("description");
    todos.dropColumn("deadline");
  });
};
