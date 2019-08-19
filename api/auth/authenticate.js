/*
  authenticate: initial token login, update database info
*/
const decode = require('./decode');
const User = require('../resources/User/user.model');

module.exports = async (req, res, next) => {
  // find user first
  const user = await User.findById(req.user.id);

  if (user) {
    // verify token exists
    next();
  } else {
    // if user doesn't exist, then insert
    User.insert(req.user);
    next();
  }
};
