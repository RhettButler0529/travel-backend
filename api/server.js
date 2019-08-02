// Import dependencies and general middleware
const express = require('express');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.PLACES_API_KEY,
  Promise,
});
const configureMiddleware = require('./middleware.js');

const server = express();
const graphql = require('./graphqlServer');
const decodeToken = require('./auth/token.js');
const authorize = require('./auth/login.js');

// Pass server through middleware file
configureMiddleware(server);

// require("../config/passport.js")(passport);

// Custom restricted middleware import
// const restricted = require("../auth/restricted.js");

// Import various split API routes
const usersRouter = require('../users/usersRouter.js');
// const authRouter = require("../auth/authRouter.js");
// Router assignments
server.use('/api/users', usersRouter);
server.use('/gql', graphql);
server.post('/api/auth', decodeToken, authorize, (req, res) => {
  // id, token, email, name
  // console.log("req.headers.authorization", req.headers.authorization);
  // console.log("res.googleId", res.googleId);
  res.json({
    message: 'success auth',
  });
});


server.get('/a', async (req, res) => {
  try {
    // gets a results array of places objects
    // query.q should be a city e.g. San Francisco
    const { json: { results: city } } = await googleMapsClient.places({
      query: req.query.q,
      language: 'en',
    }).asPromise();

    const cityPhotoReference = city[0].photos[0].photo_reference;

    const cityReq = await googleMapsClient.placesPhoto({
      photoreference: cityPhotoReference,
      maxwidth: 2400,
    }).asPromise();

    const cityPicture = `https://${cityReq.client.servername}${cityReq.req.path}`;

    const { geometry: { location } } = city[0];

    const { json: { results } } = await googleMapsClient.places({
      query: 'stuff to do',
      location: Object.values(location),
      language: 'en',
    }).asPromise();

    const places = await Promise.all(results.filter(({ photos }) => photos).map(async ({
      name,
      place_id: placeId,
      price_level: price,
      photos,
      rating,
      types,
    }) => {
      const picRef = photos[0].photo_reference;
      const pictureReq = await googleMapsClient.placesPhoto({
        photoreference: picRef,
        maxwidth: 400,
      }).asPromise();

      console.log(pictureReq.connection._host); // eslint-disable-line

      const picture = `https://${pictureReq.connection._host}${pictureReq.req.path}`; // eslint-disable-line

      return {
        name,
        placeId,
        price,
        rating,
        types,
        picture,
      };
    }));

    // parse data and cache to db if needed

    res.send({
      status: 'success',
      cityPicture,
      places: places.sort((a, b) => (b.rating - a.rating)),
    });
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.send(error);
  }
});

server.get('/a/:placeid', async (req, res) => {
  try {
    const data = await googleMapsClient.place({
      placeid: req.params.placeid,
      language: 'en',
    }).asPromise();

    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log(error); // eslint-disable-line
    res.status(500).json({
      status: 'error',
      error,
    });
  }
});

// Generic / route for initial server online status check
const projectName = process.env.PROJECT_NAME || 'test';
server.get('/', (req, res) => {
  res.send(`The ${projectName} server is up and running!`);
});

// Server export to be used in index.js
module.exports = server;

// Login sign-up post
// middleware checking the token
