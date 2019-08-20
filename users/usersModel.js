const db = require('../database/db.config');

function find() {
  return db('users');
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

function insert(creds) {
  return db('users')
    .insert(creds)
    .then(ids => ids);
}

function update(id, changes) {
  return db('users')
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db('users')
    .where({ id })
    .del();
}

module.exports = {
  find,
  findById,
  insert,
  remove,
  update,
};
