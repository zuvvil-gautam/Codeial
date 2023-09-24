const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function (req, res) {
    try{

        let post =await Post.findById(req.body.post);
        
        if (!post) {
            console.log('Post not found');
            return res.redirect('/');
        }
        
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            
           

            // Fetch the user's name and attach it to the comment
            let user = await User.findById(req.user._id);
            comment.user = {
                _id: user._id,
                name: user.name,
                email: user.email
            };

            post.comments.push(comment);
            post.save();

            commentsMailer.newComment(comment);
            if(req.xhr)
            {
                //Similar for comments to fetch the user's id!
                return res.status(200).json
                ({
                    data:
                    {
                        comment: comment
                    },
                    message: "Comment created"
                });
            }

            req.flash('success', 'Comment Added');
            
            return res.redirect('back');
        }
    } 
                
    catch(err){
        console.log(err);
        req.flash('error', 'err');
        return res.redirect('back');
    }
    
        
};


module.exports.destroy = async function(req,res){

    try {
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let postId = comment.post;
            comment.deleteOne();



            
            
            let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id} });
            
            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }
            req.flash('success', 'Comment Removed');

            return res.redirect('back');
 
        } else{
            req.flash('error','Unauthorized');
            return res.redirect('back');
        }
    } catch(err){
        req.flash('error', err);
        return;
    }
}