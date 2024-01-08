const Post = require('../models/post');
const User = require('../models/user');

const friends = require('../models/friendship');


module.exports.home = async function (req, res) {

    try{

        // Populate the user of each post and its comments using promises
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .populate({
            path:'comments',
            populate:
            {
                path: 'likes'
            }
        })
        .populate('likes');
        
        // Fetch all users using a promise
        let users = await User.find({}).populate('friendships');
        
        
        // Render the home view with the retrieved data
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users,
            friends: friends
        });
    } catch(err){
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
};



//module.exports.actionName = function(req,res){}