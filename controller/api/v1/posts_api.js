module.exports.index = function(req,res){
    return res.json(200,{
        message: 'Welcome to the API',
        posts: []
    })
}