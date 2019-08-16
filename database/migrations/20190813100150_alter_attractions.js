exports.up = knex => knex.schema.alterTable('attraction', (table) => {
  table.string('picture');
  table.text('description');
});

exports.down = knex => knex.schema.alterTable('attraction', (table) => {
  // NOTE: These might need a .alter chain, docs unclear
  table.dropColumn('picture');
  table.dropColumn('description');
});
