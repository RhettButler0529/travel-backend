exports.up = knex => knex.schema.createTable('user_destination', (table) => {
  table.increments('id');
  table.integer('user_id')
    .notNullable()
    .unsigned()
    .references('id')
    .inTable('users')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE');
  table.integer('destination_id')
    .notNullable()
    .unsigned()
    .references('id')
    .inTable('destination')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE');
});

exports.down = knex => knex.schema.dropTableIfExists('user_destination');
