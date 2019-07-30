const express = require('express');
const graphql = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL buildSchema
const schema = buildSchema(`
    type Query  {
        message: String
    }
`);

const root = {
  message: () => 'Hello World',
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

// app.listen(4000, () => console.log('Express GraphQL server now running ...'));

module.exports = app;
