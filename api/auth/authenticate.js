const decode = require('./decode');
const User = require('../resources/User/user.model');

module.exports = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    const {
      sub: id,
      aud: clientId,
      email,
      given_name: first,
      family_name: last,
    } = await decode.remote(token);

    if (clientId !== process.env.OAUTH_GOOGLE_ID) {
      // mismatch client ID, super sketch
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Client ID',
      });
    }

    req.user = {
      id,
      email,
      name: `${first} ${last}`,
      token,
    };

    const user = await User.get(id);

    if (user) {
      await User.update(id, { token });
    } else {
      await User.add(req.user);
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Unknown Server Error',
      token: req.headers.authorization,
      raw: error,
    });
  }
};
