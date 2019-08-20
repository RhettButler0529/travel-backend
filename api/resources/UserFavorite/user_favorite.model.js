const UserFavorite = require('../../../database/models')('user_favorite');

// get attractions for specified user id
const getAttractions = id => UserFavorite.cb(async db => db('attraction')
  .select('*')
  .leftOuterJoin('user_favorite', { 'user_favorite.attraction_id': 'attraction.id' })
  .where({ 'user_favorite.user_id': id }));

module.exports = {
  ...UserFavorite,
  getAttractions,
};
