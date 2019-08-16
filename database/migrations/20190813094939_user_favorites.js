exports.up = knex => knex.schema.createTable('user_favorite', (table) => {
  table.increments('id');
  table.integer('user_id')
    .notNullable()
    .unsigned()
    .references('id')
    .inTable('users')
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

exports.down = knex => knex.schema.dropTableIfExists('user_favorite');
