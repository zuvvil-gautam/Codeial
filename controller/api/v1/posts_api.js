const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
const Like = require('../../../models/like');

module.exports.index = async function(req,res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate:{ //for comment
                path: 'likes'
            }
        }).populate('likes'); //for post


    return res.json(200,{
        message: 'List of Posts',
        posts: posts
    })
}

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);

        await Like.deleteMany({likeable: post, onModel: 'Post'});
        await Like.deleteMany({_id: {$in: post.comments}});

        if(post.user == req.user.id){
            post.deleteOne();

            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: "Post and associated comments deleted successfully"
            });

        }else{
           return res.json(401,{
            message:"You cannot delete this post!"
           });
        }
    }catch (err) {
        console.log('*****error',err);
        return res.json(500,{
            message: "Internal Server Error"
        });
    }
}