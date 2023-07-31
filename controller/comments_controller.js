const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function (req, res) {
    Post.findById(req.body.post)
        .then(post => {
            if (!post) {
                console.log('Post not found');
                return res.redirect('/');
            }

            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
                .then(comment => {
                    post.comments.push(comment);
                    return post.save();
                })
                .then(() => {
                    res.redirect('/');
                })
                .catch(err => {
                    console.log('Error in posting comment:', err);
                    res.redirect('/');
                });
        })
        .catch(err => {
            console.log('Error finding post:', err);
            res.redirect('/');
        });
};



// Function to find a comment by ID and return a promise
function findCommentByIdAsync(id) {
    return Comment.findById(id).exec();
}

// Function to update a post and return a promise
function updatePostAsync(postId, commentId) {
    return Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } }).exec();
}

module.exports.destroy = function (req, res) {
    // Step 1: Find the comment by its ID
    findCommentByIdAsync(req.params.id)
        .then((comment) => {
            // Step 2: Check if the comment exists
            if (!comment) {
                return Promise.reject('Comment not found');
            }

            // Step 3: Check if the current user is the owner of the comment
            if (comment.user.toString() === req.user.id) {
                // Step 4: Delete the comment and update the associated post
                let postId = comment.post;

                // Step 4.1: Delete the comment
                return comment.deleteOne().then(() => {
                    // Step 4.2: Update the post by removing the comment ID from the comments array
                    return updatePostAsync(postId, req.params.id);
                });
            } else {
                return Promise.reject('User is not authorized to delete this comment');
            }
        })
        .then(() => {
            // Step 5: Redirect the user back to the previous page after successful deletion
            res.redirect('back');
        })
        .catch((err) => {
            // Step 6: Handle errors if any
            console.error('Error in deleting comment:', err);
            res.status(500).send('Error deleting comment. Please try again later.');
        });
};

