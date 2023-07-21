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
module.exports.create = function(req,res){
    //todo later
}

module.exports.createSession = function(req,res){
    //todo later
}