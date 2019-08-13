exports.up = knex => knex.schema
  .createTable('type', (table) => {
    table.increments('id');
    table.string('name')
      .notNullable()
      .unique()
      .index();
  })
  .createTable('attraction_type', (table) => {
    table.increments('id');
    table.integer('attraction_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('attraction')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.integer('type_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('type')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });

exports.down = knex => knex.schema
  .dropTableIfExists('attraction_type')
  .dropTableIfExists('type');
