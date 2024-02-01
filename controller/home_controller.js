const Friendship = require('../models/friendship');
const Post = require('../models/post');
const User = require('../models/user');

const friends = require('../models/friendship');


module.exports.home = async function (req, res) {

    try{

        // Populate the user of each post and its comments using promises
        const loggedInUserId = req.user;

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
        let users = await User.find({});

        let friendlist = await Friendship.find({from_user: loggedInUserId})
        .populate({
            path: 'to_user',
            populate:{
                path:'name'
            }
        })

        //console.log('user friends:: ', friendlist[0].to_user);
        
        // Render the home view with the retrieved data
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users,
            all_friends: friendlist
        });
    } catch(err){
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
};



//module.exports.actionName = function(req,res){}