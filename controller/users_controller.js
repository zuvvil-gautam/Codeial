const User = require('../models/user');

module.exports.profile = function (req, res) {
    User.findById(req.params.id)
        .exec()
        .then(user => {
            return res.render('user_profile', {
                title: 'User Profile',
                profile_user: user
            });
        })
        .catch(err => {
            console.log("Error:", err);
            return res.status(500).send("Internal Server Error");
        });
};




//render the sign in page
module.exports.signIn = function(req,res){
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }

    res.render('user_sign_in',{
        title: "Codial | Sign In"
    })
}
//render the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    res.render('user_sign_up',{
        title: "Codial | Sign Up"
    })
}

//get the sign up data

module.exports.create = function (req, res) {
    if (req.body.password !== req.body.confirm_password) {
        res.redirect('back');
    }

    const findUser = (query) => {
        return User.findOne(query).exec();
    };

    const createUser = (userData) => {
        return User.create(userData);
    };

    findUser({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return createUser(req.body);
            } else {
                return Promise.reject('User already exists');
            }
        })
        .then(() => {
            return res.redirect('/user/sign-in');
        })
        .catch((err) => {
            console.error('Error in creating user while signing up:', err);
            return res.status(500).send('Error creating user. Please try again later.');
        });
};


module.exports.createSession = function(req,res){
    res.redirect('/user/profile');
}

module.exports.destroySession = function (req, res) {
    // Using a callback to logout
    req.logout(function (err) {
        if (err) {
            console.log('Error while logging out:', err);
        }
        return res.redirect('/');
    });
};

