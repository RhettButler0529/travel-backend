const axios = require("axios");

module.exports = (req, res, next) => {
  axios
    .get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
        req.headers.authorization
      }`
    )
    .then(({ data }) => {
      res.googleId = data.sub;
      next();
    })
    .catch(err => {
      console.log(err);
    });
};
