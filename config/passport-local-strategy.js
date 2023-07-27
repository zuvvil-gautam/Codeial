const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

function findUserByEmail(email) {
    return User.findOne({ email: email }).exec();
}

// Authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (email, password, done) {
        // Find a user and establish the identity using a promise
        findUserByEmail(email)
            .then(user => {
                if (!user || user.password !== password) {
                    console.log("Invalid credentials");
                    return done(null, false);
                }

                return done(null, user);
            })
            .catch(err => {
                console.log('Error in finding user --> Passport');
                return done(err);
            });
    }));







//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    // Find the user by id using a promise
    findUserById(id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            console.log('Error in finding user --> Passport');
            return done(err);
        });
});

function findUserById(id) {
    return User.findById(id).exec();
}


module.exports = passport;