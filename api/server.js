// Import dependencies and general middleware
const express = require('express');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.PLACES_API_KEY,
  Promise,
});
const configureMiddleware = require('./middleware.js');

const server = express();
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
server.post('/api/auth', decodeToken, authorize, (req, res) => {
  // id, token, email, name
  // console.log("req.headers.authorization", req.headers.authorization);
  // console.log("res.googleId", res.googleId);
  res.json({
    message: 'success auth',
  });
});

/*
  data.json.results
*/

server.get('/a', async (req, res) => {
  try {
    const data = await googleMapsClient.places({
      query: 'fast food',
      language: 'en',
      location: [-33.865, 151.038],
      radius: 5000,
      minprice: 1,
      maxprice: 4,
      opennow: true,
      type: 'restaurant',
    }).asPromise();

    // parse data and cache to db if needed

    res.send({
      status: 'success',
      data,
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

    console.log(data);

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
})

// Generic / route for initial server online status check
const projectName = process.env.PROJECT_NAME || 'test';
server.get('/', (req, res) => {
  res.send(`The ${projectName} server is up and running!`);
});

// Server export to be used in index.js
module.exports = server;

// Login sign-up post
// middleware checking the token
