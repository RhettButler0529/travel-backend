exports.up = knex => knex.schema.createTable('itinerary', (table) => {
  table.increments('id');
  table.integer('user_id').notNullable()
    .unsigned()
    .references('id')
    .inTable('users')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE');
  table.integer('destination_id').notNullable()
    .unsigned()
    .references('id')
    .inTable('destination')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE');
})
  .createTable('attraction', (table) => {
    table.increments('id');
    table.integer('place_id').notNullable().unique();
    table.string('name').notNullable();
    table.float('lng').notNullable();
    table.float('lat').notNullable();
    table.string('address').notNullable();
    table.string('phone').notNullable();
    table.integer('price').notNullable();
    table.float('rating').notNullable();
    table.integer('total_ratings').notNullable();
  })
  .createTable('itinerary_attraction', (table) => {
    table.increments('id');
    table.integer('itinerary_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('itinerary')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.integer('attraction_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('attraction')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.datetime('event_time');
  });


exports.down = knex => knex.schema
  .dropTableIfExists('itinerary_attraction')
  .dropTableIfExists('itinerary')
  .dropTableIfExists('attraction');
