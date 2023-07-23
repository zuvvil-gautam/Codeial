const User = require('../models/user');

module.exports.profile = function(req,res){
    res.render('userProfile',{
        title: 'User Profile'
    });
}

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