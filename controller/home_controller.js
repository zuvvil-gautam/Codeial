const Post = require('../models/post');

module.exports.home = function (req, res) {
    Post.find()
        .populate('user')
        .exec()
        .then(posts => {
            res.render('home', {
                title: 'Codeial | Home', // Title of the page to be displayed in browser tab and header section
                posts: posts
            });
        })
        .catch(err => {
            console.error('Error fetching posts from the database:', err);
            res.status(500).send('Error fetching posts. Please try again later.');
        });
};


//module.exports.actionName = function(req,res){}