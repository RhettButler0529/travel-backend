const db = require('../database/dbConfig.js');

function find() {
  return db('user');
}

function findById(id) {
  return db('user')
    .where({ id })
    .first();
}

function insert(user) {
  return db('user')
    .insert(user)
    .then(ids => ids);
}

function update(id, changes) {
  return db('user')
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db('user')
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
