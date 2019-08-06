const express = require('express');
const graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const userDb = require('../mock/users')(30);

// GraphQL buildSchema
const schema = buildSchema(`
    type Query  {
        message: String,
        user(id: String!): User,
        users: [User]
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
    }
`);

const root = {
  message: () => 'Hello World',
  user: ({ id }) => userDb.find(user => user.id === id),
  users: () => userDb,
};

// Create an express server and GraphQL endpoint
const app = express.Router();
app.use('/', graphql({
  schema,
  rootValue: root,
  graphiql: true,
}));

module.exports = app;
