exports.up = knex => {
  return knex.schema.createTable("users", tbl => {
    tbl.increments("id");
    tbl.string("username", 128).notNullable().unique();
     
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists("users");
};
