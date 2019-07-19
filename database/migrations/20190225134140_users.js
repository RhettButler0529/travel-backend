exports.up = knex => knex.schema.createTable('users', (tbl) => {
  tbl.increments('id');
  tbl.string('username', 128).notNullable().unique();
});

exports.down = knex => knex.schema.dropTableIfExists('users');
