const db = require('./db.config');

const get = table => (id) => {
  if (!id) return db(table);
  return db(table).where({ id }).first();
};

const getBy = table => filter => db(table).where(filter);

const cb = method => method(db);

// TODO: returning is optional here, passing undefined to insert should be fine
const add = table => (data, returning) => db(table)
  .insert(data, returning)
  .then(ids => ids[0]);

const update = table => (id, data) => db(table)
  .where({ id })
  .update(data)
  .then(() => get(table)(id));

const updateIfExists = table => async (id, data) => {
  const attraction = await getBy(table)({ id });

  if (attraction) {
    const result = await update(table)(id, data);
    return result;
  }

  const result = await add(table)(data);
  return result;
};

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
  updateIfExists: updateIfExists(table),
  remove: remove(table),
  cb,
});
