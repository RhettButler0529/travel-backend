// Import dependencies and general middleware
const express = require('express');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.PLACES_API_KEY,
  Promise,
});
const configureMiddleware = require('./middleware.js');

const server = express();
const places = require('./resources/Place');
const graphql = require('./graphqlServer');
const authenticate = require('./auth/authenticate');
const authorize = require('./auth/authorize');

// Pass server through middleware file
configureMiddleware(server);

// TODO: Clean up usersRouter and /api/users -- we should no longer need these
const usersRouter = require('../users/usersRouter.js');

server.use('/api/users', usersRouter);

// Router assignments
server.use('/places', places);
server.use('/gql', graphql);

server.post('/api/auth', authenticate, (req, res) => {
  // id, token, email, name
  res.json({
    message: 'success auth',
  });
});

// TODO: Remove this, temp for authorize
server.get('/api/authorize', authorize, (req, res) => {
  res.json({
    message: 'success auth',
  });
});

// TODO: This needs to be abstracted
server.get('/city/image', async (req, res) => {
  try {
    const { json: { results: city } } = await googleMapsClient.places({
      query: req.query.q,
      language: 'en',
    }).asPromise();

    const cityPhotoReference = city[0].photos[0].photo_reference;

    const pictureReq = await googleMapsClient.placesPhoto({
      photoreference: cityPhotoReference,
      maxwidth: 1200,
    }).asPromise();

    res.json({
      status: 'success',
      cityImg: `https://${pictureReq.connection._host}${pictureReq.req.path}`, // eslint-disable-line
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unknown Error',
    });
  }
});

// Generic / route for initial server online status check
// const projectName = process.env.PROJECT_NAME || 'test';
server.get('/', (req, res) => {
  res.json({
    message: 'API is up',
  });
});

// Server export to be used in index.js
module.exports = server;

// Login sign-up post
// middleware checking the token
