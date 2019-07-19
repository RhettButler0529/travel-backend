// Import dependencies and general middleware
const express = require("express");
const cors = require("cors");
const configureMiddleware = require("./middleware.js");
const server = express();
const passport = require("passport");
const decodeToken = require("./auth/token.js");
const bodyparser = require("body-parser");

server.use(bodyparser.json());

// Pass server through middleware file
configureMiddleware(server);

require("../config/passport.js")(passport);

server.use(passport.initialize());
server.use(passport.session());

// Custom restricted middleware import
// const restricted = require("../auth/restricted.js");

// Import various split API routes
const usersRouter = require("../users/usersRouter.js");
// const authRouter = require("../auth/authRouter.js");
// Router assignments
server.use("/api/users", usersRouter);
server.post("/api/auth", decodeToken, (req, res) => {
  console.log("req.headers.authorization", req.headers.authorization);
  console.log("res.googleId", res.googleId);
});

// Generic / route for initial server online status check
const projectName = process.env.PROJECT_NAME || "test";
server.get("/", (req, res) => {
  res.send(`The ${projectName} server is up and running!`);
});

// Server export to be used in index.js
module.exports = server;

// Login sign-up post
// middleware checking the token
