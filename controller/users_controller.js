const User = require('../models/user');

module.exports.profile = function (req, res) {
    if (req.cookies.user_id) {
        // Check if 'user_id' cookie exists in the request
        // If it exists, we assume the user is authenticated

        User.findById(req.cookies.user_id)
            .then((user) => {
                // Try to find the user in the database by their 'user_id'

                if (user) {
                    // If the user is found in the database, render the 'userProfile' view template
                    // with the user data

                    res.render('userProfile', {
                        title: "User Profile",
                        user: user
                    });
                } else {
                    // If the user is not found in the database, redirect to the sign-in page

                    res.redirect('/user/sign-in');
                }
            })
            .catch((err) => {
                // If any error occurs during the database query (findById), handle it here

                console.log('Error in finding user:', err);
                res.redirect('/user/sign-in');
            });
    } else {
        // If the 'user_id' cookie is not present in the request, it means the user is not authenticated,
        // so redirect them to the sign-in page

        res.redirect('/user/sign-in');
    }
};


//render the sign in page
module.exports.signIn = function(req,res){
    res.render('user_sign_in',{
        title: "Codial | Sign In"
    })
}
//render the sign up page
module.exports.signUp = function(req,res){
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


module.exports.createSession = function (req, res) {

    const findUser = (query) => {
        return User.findOne(query).exec();
    }

    findUser({email: req.body.email})
        .then((user) => {

            if(user){

                    if(user.password != req.body.password){
                        res.redirect('back');
                }
                
                //handle session creation
                res.cookie('user_id', user.id);
                res.redirect('/user/profile');;
            
            }else{
                res.redirect('back');
            }

        }) 
        .catch(err => {
             console.log('error in finding user in signing in'); return 

        })

}