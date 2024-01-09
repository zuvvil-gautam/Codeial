module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    //2..
        io.sockets.on('connection', function(socket){
            console.log('New connection received', socket.id);

            socket.on('disconnect',function(){
                console.log('Socket disconnected');
            });

            socket.on('join_room',function(data){
                console.log('Joining request rec.',data);

                socket.join(data.chatroom);

                io.in(data.chatroom).emit('user_joined',data);
            })
        });
}