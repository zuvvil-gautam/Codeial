const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/user_email_worker');

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

module.exports.update = async function (req, res) {

    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){ console.log('****Multer Error: ', err)}

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if(user.avatar){
                        let currAvatarPath = path.join(__dirname, '..', user.avatar);

                        if(fs.existsSync(currAvatarPath)){

                            fs.unlinkSync(currAvatarPath);
                        }
                    }
                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
                console.log(req.file);
            });
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    } else{
        req.flash('error', 'Unauthorized: ');
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


module.exports.resetPassword = function(req,res){
    return res.render('reset_password',{
        title:'Codeial | Reset Password',
        access: false
    });
}

module.exports.resetPassMail = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();

        if (!user) {
            req.flash('error', 'User not found. Try again!');
            return res.redirect('back');
        }

        if (!user.isTokenValid) {
            user.accessToken = crypto.randomBytes(30).toString('hex');
            user.isTokenValid = true;
            await user.save();
        }

        let job = queue.create('user-emails', user).save(function (err) {
            if (err) {
                console.log('Error in sending to the queue', err);
                return;
            }
            // console.log('Job enqueued', job.id);
        });

        req.flash('success', 'Password reset link sent. Please check your mail');
        return res.redirect('/');
    } catch (err) {
        console.log('Error in finding user', err);
        req.flash('error', 'An error occurred. Please try again later.');
        return res.redirect('back');
    }
};


module.exports.setPassword = async function (req, res) {
    try {
        const user = await User.findOne({ accessToken: req.params.accessToken }).exec();

        if (!user) {
            console.log('User not found');
            return;
        }

        if (user.isTokenValid) {
            return res.render('reset_password', {
                title: 'Codeial | Reset Password',
                access: true,
                accessToken: req.params.accessToken
            });
        } else {
            req.flash('error', 'Link expired');
            return res.redirect('/user/reset-password');
        }
    } catch (err) {
        console.log('Error in finding user', err);
        return;
    }
};


module.exports.updatePassword = async function (req, res) {
    try {
        const user = await User.findOne({ accessToken: req.params.accessToken }).exec();

        if (!user) {
            console.log('User not found');
            return;
        }

        if (user.isTokenValid) {
            if (req.body.newPass == req.body.confirmPass) {
                user.password = req.body.newPass;
                user.isTokenValid = false;
                await user.save();
            } else {
                req.flash('error', "Passwords don't match");
                return res.redirect('back');
            }
        } else {
            req.flash('error', 'Link expired');
            return res.redirect('/user/reset-password');
        }

        req.flash('success', "Password updated. Login now!");
        return res.redirect('/user/sign-in');
    } catch (err) {
        console.log('Error in finding user', err);
        return;
    }
};
