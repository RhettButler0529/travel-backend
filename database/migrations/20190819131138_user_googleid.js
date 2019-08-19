exports.up = knex => knex.schema.alterTable('user', (table) => {
  table.string('google_id');
});

exports.down = knex => knex.schema.alterTable('user', (table) => {
  // NOTE: These might need a .alter chain, docs unclear
  table.dropColumn('google_id');
});
