//frontend establishing

class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        //this tell go and connect
        //1..

        this.socket= io.connect('http://localhost:5000'); //io-is global variable by socket.io file


        if(this.userEmail){
            this.connectionHandler();
        }
    }

    //3..

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log("Connection established using sockets...!");

            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom:'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('A user joined..!',data);
            });
        });
    }
}