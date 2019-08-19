const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const {
      data: {
        sub: id,
        aud,
        email,
        given_name: first,
        family_name: last,
      },
    } = await axios
      .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.headers.authorization}`);

    // const response = await axios.get(
    //   `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.headers.authorization}`
    // );

    // validate client id
    if (aud !== process.env.OAUTH_GOOGLE_ID) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Client ID provided',
      });
    }

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
