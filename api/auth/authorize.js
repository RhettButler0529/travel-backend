const decode = require('./decode');
require('dotenv').config();

const User = require('../resources/User/user.model');

const validateToken = async (token) => {
  // get expires and google_id from decoded token
  const { exp: expires, sub: id } = decode.local(token);

  // Get current epoch time, divide by 1000 and floor to drop last three digits
  // expire time returned by google is 10 digits, getTime returns 13 for extra granularity
  const now = Math.floor((new Date()).getTime() / 1000);
  if (now > expires) {
    // expired token
    return {
      valid: false,
      message: 'expired token',
      status: 401,
    };
  }

  // check database
  const user = await User.getBy({ id });

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
      User.update(user.id, {
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
    const { valid, message, status } = await validateToken(req.headers.authorization);

    if (!valid) {
      // return unauthorized
      return res.status(status).json({
        status: 'error',
        message,
      });
    }

    const {
      sub: id,
      email,
      given_name: first,
      family_name: last,
    } = decode.local(req.headers.authorization);

    req.user = {
      id,
      email,
      name: `${first} ${last}`,
      token: req.headers.authorization,
    };

    return next();
  } catch (error) {
    // default error catch
    return res.status(500).json({
      status: 'error',
      message: 'Unknown Server Error',
    });
  }
};
