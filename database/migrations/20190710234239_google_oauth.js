exports.up = knex => {
  return knex.schema.createTable('user', table => {
    table.string('id').notNullable().unique();
    table.string('token').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('name').notNullable().unique();
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('user');
};
