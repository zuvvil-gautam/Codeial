const Post = require('../models/post');

module.exports.create = function (req, res) {
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
        .then(post => {
            // Do any additional operations or processing here if needed.

            res.redirect('back');
        })
        .catch(err => {
            console.log('Error in creating post:', err);
            res.redirect('back');
        });
};
