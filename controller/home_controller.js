module.exports.home = function(req,res){

    res.render('home',{
        title: 'Home' //title of the page to be displayed in browser tab and header section
    });
}

//module.exports.actionName = function(req,res){}