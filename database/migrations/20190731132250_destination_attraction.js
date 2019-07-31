exports.up = knex => knex.schema.createTable('destination_attraction', (table) => {
  table.increments('id');
  table.integer('destination_id')
    .notNullable()
    .unsigned()
    .references('id')
    .inTable('destination')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE');
  table.integer('attraction_id')
    .notNullable()
    .unsigned()
    .references('id')
    .inTable('attraction')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE');
});

exports.down = knex => knex.schema.dropTableIfExists('destination_attraction');