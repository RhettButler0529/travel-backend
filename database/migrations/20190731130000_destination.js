exports.up = knex => knex.schema.createTable('destination', (table) => {
  table.increments('id');
  table.string('name').notNullable();
  table.timestamps('updated_at');
});

exports.down = knex => knex.schema.dropTableIfExists('destination');
