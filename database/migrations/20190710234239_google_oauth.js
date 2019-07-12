exports.up = knex => {
  return knex.schema.createTable('user', table => {
    table.string('id').notNullable().unique();
    table.text('token').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('name').notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('user');
};
