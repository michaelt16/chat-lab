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
    
}

// fetch('https://randomuser.me/api')
//   .then(response => response.json())
//   .then(data => image = data.results[0].picture.thumbnail)
//   .catch(error => console.error(error));

//run when client connects
io.on('connection', socket=>{
    console.log("connected to socket")
    
    //broadcast when a user connect
    socket.on("addUser", username=>{
        io.emit("userList", users)
        console.log(username,image)
        addUser(username,image)
        socket.emit("message",`Welcome to the chat, ${username}!`)
        socket.broadcast.emit("message", `${username} has joined the chat`)
    })
    
    //runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message','a user left')
    })
    
    //listen to chatmessage
    socket.on('chatMessage', (msg)=>{
        //send the received message back to the client
        
        io.emit("message",msg)
    })
})

const PORT = 8080

server.listen (PORT,()=>console.log('server running on port: '+PORT))