const express = require('express');
const graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const userDb = require('../mock/users')(30);
const UserFavorite = require('./resources/UserFavorite/user_favorite.model');
const User = require('../database/models')('user');
const Attraction = require('../database/models')('attraction');
const authorize = require('./auth/authorize');

// GraphQL buildSchema
const schema = buildSchema(`
    type Query  {
        message: String,
        user: User,
        favorites: [Favorite],
        users: [User],
    },
    type Mutation {
      addFavorite(id: Int!): Favorite,
      removeFavorite(id: Int!): Favorite,
    },
    type Favorite {
      id: Int,
      user_id: String,
      attraction_id: Int,
    },
    type User {
      id: String,
      name: String,
      email: String,
    },
    type Itinerary {
      id: String,
      attractions: [Attraction],
    },
    type Attraction {
      id: Int,
      placeId: String,
      name: String,
      description: String,
      lat: String,
      lng: String,
      address: String,
      phone: String,
      price: Int,
      rating: Float,
      numRatings: Int,
    },
`);

// resolvers
const root = req => ({
  message: () => 'Hello World',
  // user: ({ id }) => userDb.find(user => user.id === id),
  user: () => User.get(req.user.id),
  users: () => userDb,
  favorites: async () => {
    const favorites = await UserFavorite.getAttractions(req.user.id);
    console.log(favorites);
    // special table shit
    return [];
  },
  addFavorite: async ({ id }) => UserFavorite.add({
    user_id: req.user.id,
    attraction_id: id,
  }, ['id', 'user_id', 'attraction_id']),
  removeFavorite: async ({ id }) => {
    // check that we're not trying to remove a different users favorites
    const { user_id: userId } = await UserFavorite.get(id);
    if (userId === req.user.id) {
      return UserFavorite.remove(id);
    }
    return null;
  },
});

// Create an express router and GraphQL endpoint
const app = express.Router();

app.use('/', authorize, graphql(async (req, res, gqlParams) => ({
  schema,
  rootValue: await root(req),
  graphiql: true,
})));

module.exports = app;
