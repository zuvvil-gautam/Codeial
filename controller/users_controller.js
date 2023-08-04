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

module.exports.update = function (req, res) {
    if (req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body)
            .exec()
            .then(user => {
                req.flash('success', 'Profile updated!');
                return res.redirect('back');
            })
            .catch(err => {
                console.log("Error:", err);
                return res.status(500).send("Internal Server Error");
            });
    } else {
        return res.status(401).send('Unauthorized');
    }
};




//render the sign in page
module.exports.signIn = function(req,res){
    if (req.isAuthenticated()) {
        res.redirect('/user/profile/' + req.user.id);
    }

    return res.render('user_sign_in',{
        title: "Codial | Sign In"
    })
}
//render the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        res.redirect('/user/profile/' + req.user.id);
    }
    return res.render('user_sign_up',{
        title: "Codial | Sign Up"
    })
}

//get the sign up data

module.exports.create = async function (req, res) {
    if (req.body.password !== req.body.confirm_password) {
        return res.redirect('back');
    }

    const findUser = (query) => {
        return User.findOne(query).exec();
    };

    const createUser = (userData) => {
        return User.create(userData);
    };

    try {
        const user = await findUser({ email: req.body.email });

        if (!user) {
            await createUser(req.body);
            req.flash('success', 'Sign up completed!');
            return res.redirect('/user/sign-in');
        } else {
            //throw new Error('User already exists');
            req.flash('error','Email already exists!')
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',err);
        return res.status(500).send('Error creating user. Please try again later.');
    }
};


module.exports.createSession = function(req,res){
    req.flash('success', 'Logged in Successfully');
    res.redirect('/user/profile/' + req.user.id);
}

module.exports.destroySession = function (req, res) {
    // Using a callback to logout
    req.logout(function (err) {
        if (err) {
            console.log('Error while logging out:', err);
        }

        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    });
};

