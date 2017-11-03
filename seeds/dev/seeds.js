
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {
					first_name: 'John',
					last_name: 'Smith'
				},
        {
					first_name: 'John',
					last_name: 'Smith'
				},
        {
					first_name: 'John',
					last_name: 'Smith'
				}
      ]);
    });
};
