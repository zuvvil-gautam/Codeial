const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try{

        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            })
        }
        req.flash('success', 'Post published!');
            
        res.redirect('back');
        
    }
    
    catch(err) {
        req.flash('error', err);
        res.redirect('back');
    }
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
            req.flash('success', 'Post deleted!');
            return res.redirect('back');
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        req.flash('error', err);
        return res.status(500).send('Error deleting post and comments. Please try again later.');
    }
};


