//frontend establishing

class ChatEngine{
    constructor(chatBoxId, userEmail, userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        //this tell go and connect
        //1..

        this.socket= io('http://localhost:5000',{transports:['websocket']}); //io-is global variable by socket.io file


        if(this.userEmail || this.userName){
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
                user_name: self.userName,
                chatroom:'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('A user joined..!',data);
            });
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if(msg != ''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    chatroom:'codeial'
                });
            }
            msg.value = '';
        });

        self.socket.on('receive_message',function(data){
            console.log('message received',data.message);

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if((data.user_email == self.userEmail) || (data.user_name == self.userName)){
                messageType = 'self-message';
            }

            newMessage.append($('<span>',{
                'html': data.message
            }));

            newMessage.append($('<sub>',{
                'html': data.user_name
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}