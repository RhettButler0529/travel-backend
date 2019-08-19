const decode = require('./decode');
require('dotenv').config();

const User = require('../resources/User/user.model');

const validateToken = async (token) => {
  // get expires and google_id from decoded token
  const { exp: expires, sub: googleId } = decode.local(token);

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
  const user = await User.getBy({
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
      sub: googleId,
      email,
      given_name: first,
      family_name: last,
    } = decode.local(req.headers.authorization);

    req.user = {
      googleId,
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
