exports.up = knex => knex.schema.createTable('destination_alias', (table) => {
  table.increments('id');
  table.integer('destination_id')
    .notNullable()
    .unsigned()
    .references('id')
    .inTable('destination')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE');
  table.string('alias')
    .notNullable()
    .unique()
    .index();
});

exports.down = knex => knex.schema.dropTableIfExists('destination_alias');
