const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url,
},

    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ email: profile.emails[0].value }).exec();

            if (user) {
                // If user exists, set this user as req.user
                return done(null, user);
            } else {
                // If user doesn't exist, create the user and set it as req.user
                let newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });
                return done(null, newUser);
            }
        } catch (err) {
            console.log('error in creating user google strategy-passport', err);
            return done(err);
        }
    }



));

module.exports = passport;