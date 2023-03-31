const path = require ('path')
const http = require('http')
const express = require ('express')
const fetch = require('node-fetch');
const socketio = require ('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)


let users=[]

const chatBot = "chatBot"
app.get("/", function (req,res){
    res.sendFile(path.join(__dirname,'frontend','chat-adv-client.html'))
})
app.use(express.static(path.join(__dirname,'frontend')))

function addUser(username,image){
    const userId = Math.floor(Math.random() * 70) + 1;
    
    const user = { name: username, id: userId, img: image};
    users.push(user);
    io.emit('userList',users)
    return userId;
}
function optimizeMessage(msg,socket){
    const user = users.find(u => u.id === socket.userId);
    return {
        username: user.name,
        msg: msg,
        socketId: socket.userId
    }
}

//run when client connects
io.on('connection', socket=>{
    console.log("connected to socket")
    
    //broadcast when a user connect
    socket.on("addUser", username=>{
        fetch('https://randomuser.me/api')
        .then(response => response.json())
        .then(data => {return data.results[0].picture.thumbnail})
        .then(img => {
            const userId = addUser(username, img);
            socket.emit("message", `Welcome to the chat, ${userId}!`);
            socket.broadcast.emit("message", `${username} has joined the chat`);
            io.emit("userList", users);
            socket.userId = userId;
            })
    })
    
    //runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message','a user left')
    })
    
    //listen to chatmessage
    socket.on('chatMessage', (msg)=>{
        //send the received message back to the client
        io.emit("message",optimizeMessage(msg,socket))
    })
})



const PORT = 8080

server.listen (PORT,()=>console.log('server running on port: '+PORT))