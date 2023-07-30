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

// Function to find a post by ID and return a promise
function findByIdAsync(id) {
    return Post.findById(id).lean().exec();
}

// Function to delete comments by post ID and return a promise
function deleteCommentsByPostIdAsync(postId) {
    return Comment.deleteMany({ post: postId }).exec();
}

module.exports.destroy = function (req, res) {
    findByIdAsync(req.params.id)
        .then(post => {
            if (!post) {
                return Promise.reject('Post not found');
            }

            if (post.user.toString() === req.user.id) {
                return deleteCommentsByPostIdAsync(req.params.id)
                    .then(() => Post.findByIdAndDelete(req.params.id).exec());
            } else {
                return Promise.reject('User is not authorized to delete this post');
            }
        })
        .then(() => {
            res.redirect('back');
        })
        .catch(err => {
            console.error('Error in deleting post and comments:', err);
            res.status(500).send('Error deleting post and comments. Please try again later.');
        });
};

