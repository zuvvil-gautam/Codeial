module.exports.profile = function(req,res){
    res.render('userProfile',{
        title: 'User Profile'
    });
}