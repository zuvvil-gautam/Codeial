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


//check if the user is authenticated

passport.checkAuthentication = function(req,res,next){
// if the user is signed in, then pass on the request to the next function (controller's action)
    if( req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next(); 
}




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