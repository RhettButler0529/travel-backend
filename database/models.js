const db = require('./db.config');

const get = table => (id) => {
  if (!id) return db(table);
  return db(table).where({ id }).first();
};

const getBy = table => filter => db(table).where(filter);

const cb = method => method(db);

const add = table => data => db(table)
  .insert(data)
  .then(ids => get(table)(ids[0]));

const update = table => (id, data) => db(table)
  .where({ id })
  .update(data)
  .then(() => get(table)(id));

const remove = table => async (id) => {
  const record = await get(table)(id);
  await db(table)
    .where({ id })
    .del();
  return record;
};

module.exports = table => ({
  add: add(table),
  get: get(table),
  getBy: getBy(table),
  update: update(table),
  remove: remove(table),
  cb,
});
