exports.up = knex => knex.schema.alterTable('attraction', (table) => {
  table.string('place_id').alter();
});

exports.down = knex => knex.schema.alterTable('attraction', (table) => {
  table.integer('place_id').alter();
});
