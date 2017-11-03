exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
		table.increments('id').unsigned().primary();
		table.string('first_name');
		table.string('last_name');
		table.timestamps();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users');
};
