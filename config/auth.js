require('dotenv').config();

module.exports = {
  'google': {
    'clientID': process.env.OAUTH_GOOGLE_ID,
    'clientSecret': process.env.OAUTH_GOOGLE_SECRET,
    'callbackURL': process.env.AUTH_CALLBACK_URL,
  },
};
