const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try{

        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){


            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it! (To display the user's name with the post added dynamically)
            post = await Post.findById(post._id).populate('user', 'name').exec();

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
        // added this to view the error on console as well
        console.log(err);
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

            await Like.deleteMany({likeable: post._id, onModel:'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });

            if(req.xhr)
            {
                return res.status(200).json({
                    data:
                    {
                        post_id: req.params.id
                    },
                    message: 'Post deleted'
                });
            }
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


