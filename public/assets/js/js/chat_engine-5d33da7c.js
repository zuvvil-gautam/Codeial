class ChatEngine{constructor(e,s,a){this.chatBox=$(`#${e}`),this.userEmail=s,this.userName=a,this.socket=io("http://localhost:5000",{transports:["websocket"]}),(this.userEmail||this.userName)&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(function(){console.log("Connection established using sockets...!"),e.socket.emit("join_room",{user_email:e.userEmail,user_name:e.userName,chatroom:"codeial"}),e.socket.on("user_joined",(function(e){console.log("A user joined..!",e)}))})),$("#send-message").click((function(){let s=$("#chat-message-input").val();""!=s&&e.socket.emit("send_message",{message:s,user_email:e.userEmail,user_name:e.userName,chatroom:"codeial"}),s.value=""})),e.socket.on("receive_message",(function(s){console.log("message received",s.message);let a=$("<li>"),o="other-message";s.user_email!=e.userEmail&&s.user_name!=e.userName||(o="self-message"),a.append($("<span>",{html:s.message})),a.append($("<sub>",{html:s.user_name})),a.addClass(o),$("#chat-messages-list").append(a)}))}}