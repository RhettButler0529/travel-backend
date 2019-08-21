const UserFavorite = require('../../../database/models')('user_favorite');

// get attractions for specified user id
const getAttractions = id => UserFavorite.cb(async db => db('attraction')
  .select('*')
  .leftOuterJoin('user_favorite', { 'user_favorite.attraction_id': 'attraction.id' })
  .where({ 'user_favorite.user_id': id }));

const getAttractionId = placeId => UserFavorite.cb(async (db) => {
  const attraction = await db('attraction')
    .select('id')
    .where({ place_id: placeId })
    .first();
  return attraction.id;
});

const getAttraction = id => UserFavorite.cb(async db => db('attraction').where({ id }).first());

module.exports = {
  ...UserFavorite,
  getAttractions,
  getAttractionId,
  getAttraction,
};
