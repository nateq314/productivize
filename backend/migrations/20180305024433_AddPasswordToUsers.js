exports.up = function(knex, Promise) {
  return knex.schema.table('users', table => {
		table.string('hashed_pw');
	});
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table => {
		table.dropColumn('hashed_pw');
	})
};
