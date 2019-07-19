const axios = require("axios");
require('dotenv').config();

module.exports = (req, res, next) => {
  console.log("REQ HEAD:  ",req.headers.authorization )
  axios
    .get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${ req.headers.authorization }`
      )
    .then(({ data }) => {
      const { sub: id, aud, email, given_name: first, family_name: last  } = data;

      // validate client id
      if (aud !== process.env.OAUTH_GOOGLE_ID) return res.status(401).json({
        message: 'Invalid Client ID',
      });

      req.user = {
        id,
        email,
        name: `${first} ${last}`,
        token: req.headers.authorization,
      }

      next();
    })
    .catch(err => {
     // console.log("Error:  ", err.response);
      res.status(401).json({message: 'You need to log in first', error:err });
    });
};
