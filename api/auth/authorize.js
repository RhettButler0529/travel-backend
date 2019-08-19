const axios = require('axios');
const decode = require('./decode');
require('dotenv').config();

const db = require('../resources/User/user.model');
/*

authenticate: initial token login, update database info
authorize: 1) Check token isn't expired, 2) check token matches user
  If token isn't expired but doesn't match ID, re-authorize with google
*/


// 1. Check token isn't expired (decode)
// 2. DB Query to see if it matches user
// 3. Re-authorize

const validateToken = async (token) => {
  // get expires and google_id from decoded token
  const { exp: expires, sub: googleId } = decode.local(token);

  // check expiry
  const now = (new Date()).getTime();
  if (now > expires) {
    // expired token
    return {
      valid: false,
      message: 'expired token',
      status: 401,
    };
  }

  // check database
  const user = await db.getBy({
    google_id: googleId,
  });

  if (!user) {
    // invalid token
    /*
      user should have logged in at some point, thus creating an account, prior to hitting
      any authorization middlware.
    */
    return {
      valid: false,
      message: 'nonexistent user',
      status: 401,
    };
  }

  if (user.token !== token) {
    // invalid token or session, try to re-authenticate with google
    try {
      const { aud } = await decode.remote(token);

      if (aud !== process.env.OAUTH_GOOGLE_ID) {
        return {
          valid: false,
          message: 'invalid client id',
          status: 400,
        };
      }

      // valid new token, update database
      db.update(user.id, {
        token,
      });
    } catch (error) {
      if (error.message === 'Request failed with status code 400') {
        return {
          valid: false,
          message: 'unauthorized',
          status: 401,
        };
      }

      return {
        valid: false,
        message: 'unknown',
        status: 500,
      };
    }
  }

  return {
    valid: true,
    message: 'successful auth',
    status: 200,
  };
};

module.exports = async (req, res, next) => {
  try {
    const validToken = await validateToken(req.headers.authorization);

    if (!validToken.valid) {
      // return unauthorized
    }

    const {
      sub: googleId,
      aud: clientId,
      email,
      given_name: first,
      family_name: last,
    } = decode.local(req.headers.authorization);

    if (clientId !== process.env.OAUTH_GOOGLE_ID) {
      // invalid oauth client id in token
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Client ID provided',
      });
    }

    // const {
    //   data: {
    //     sub: id,
    //     aud,
    //     email,
    //     given_name: first,
    //     family_name: last,
    //   },
    // } = await axios
    //   .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.headers.authorization}`);

    // validate client id
    // if (aud !== process.env.OAUTH_GOOGLE_ID) {
    //   return res.status(401).json({
    //     status: 'error',
    //     message: 'Invalid Client ID provided',
    //   });
    // }

    req.user = {
      id,
      email,
      name: `${first} ${last}`,
      token: req.headers.authorization,
    };

    return next();
  } catch (error) {
    // catch bad requests
    if (error.message === 'Request failed with status code 400') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }

    // catch bad auth (expired token)
    if (error.message === 'Request failed with a status code 401') {
      return res.status(401).json({
        status: 'error',
        message: error.message,
      });
    }

    // default error catch
    return res.status(500).json({
      status: 'error',
      message: 'Unknown Server Error',
      raw: error,
    });
  }
};
