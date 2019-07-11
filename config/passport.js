const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require("./userModel.js");
const auth = require('./auth.js');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  passport.deserializeUser(async (id, done) => {
    // TODO: This needs to be tested
    const user = await User.findById(id);
    if (!user) {
      done('error', user);
    }
  });
  
  passport.use(new GoogleStrategy(auth.google, (token, refreshToken, profile, done) => {
    process.nextTick(async () => {
      const { id, displayName: name, emails } = profile;

      // TODO: This needs to be tested with the Knex db model
      const user = await User.findById(profile.id);
      if (!user) {
        return done('error');
      }

      if (user) {
        return done(null, user);
      } else {
        // TODO: Test knex insertion
        User.insert({
          id,
          token,
          name,
          email: emails[0].value,
        });
      }
    });
  }));
};
