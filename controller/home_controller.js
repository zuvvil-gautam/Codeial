const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = function (req, res) {
    // Populate the user of each post and its comments using promises
    Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec()
        .then(posts => {
            // Fetch all users using a promise
            return User.find({}).exec().then(users => {
                // Render the home view with the retrieved data
                return res.render('home', {
                    title: "Codeial | Home",
                    posts: posts,
                    all_users: users
                });
            });
        })
        .catch(err => {
            console.log("Error:", err);
            return res.status(500).send("Internal Server Error");
        });
};



//module.exports.actionName = function(req,res){}