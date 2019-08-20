exports.up = knex => knex.schema.alterTable('user_favorite', (table) => {
  table.dropForeign(['user_id']);
}).alterTable('user_favorite', (table) => {
  table.string('user_id')
    .references('id')
    .inTable('user')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE')
    .alter();
});

exports.down = knex => knex.schema.alterTable('user_favorite', async (table) => {
  table.dropForeign(['user_id']);
}).alterTable('user_favorite', (table) => {
  table.integer('user_id')
    .references('id')
    .inTable('users')
    .onDelete('RESTRICT')
    .onUpdate('CASCADE')
    .alter();
});
