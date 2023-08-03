const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (post.user == req.user.id) {
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });
            return res.redirect('back');
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.error('Error in deleting post and comments:', err);
        return res.status(500).send('Error deleting post and comments. Please try again later.');
    }
};


