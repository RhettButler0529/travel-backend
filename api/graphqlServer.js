const express = require('express');
const graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const userDb = require('../mock/users')(3);

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
    },
`);

const root = {
  message: () => 'Hello World',
  user: ({ id }) => userDb.find(user => user.id === id),
  users: () => userDb,
};

// Create an express server and GraphQL endpoint
const app = express.Router();
app.use('/graphql', graphql({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/test', (req, res) => {
  res.send('This is a test');
});

module.exports = app;
