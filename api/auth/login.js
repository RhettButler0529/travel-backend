/* DEPRECIATED */
const User = require('../../users/userModel');

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
