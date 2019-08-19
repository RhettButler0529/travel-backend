const express = require('express');
const graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const userDb = require('../mock/users')(30);
const UserFavorite = require('../database/models')('user_favorite');
const authorize = require('./auth/authorize');

// GraphQL buildSchema
const schema = buildSchema(`
    type Query  {
        message: Message,
        user(id: String!): User,
        users: [User]
    },
    type Mutation {
      addFavorite: Favorite,
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
      itineraries: [Itinerary],
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
    type Message {
      message: String,
      user: Test,
    },
    type Test {
      id: String,
      name: String,
      email: String,
    }
`);

// resolvers
const root = req => ({
  message: () => ({
    message: 'Hello World',
    user: req.user,
  }),
  user: ({ id }) => userDb.find(user => user.id === id),
  users: () => userDb,
  addFavorite: async () => UserFavorite.add({ user_id: req.user.id, attraction_id: 1 }),
});

// Create an express router and GraphQL endpoint
const app = express.Router();

app.use('/', authorize, graphql(async (req, res, gqlParams) => ({
  schema,
  rootValue: await root(req),
  graphiql: true,
})));

module.exports = app;
