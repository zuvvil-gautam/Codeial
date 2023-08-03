const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function (req, res) {

    try{

        // Populate the user of each post and its comments using promises
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        
        // Fetch all users using a promise
        let users = await User.find({});
        
        
        // Render the home view with the retrieved data
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch(err){
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
};



//module.exports.actionName = function(req,res){}