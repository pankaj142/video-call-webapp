
const express = require("express");
const socket = require("socket.io");

const PORT = 5000;

const app = express();

const server = app.listen(PORT, ()=>{
    console.log(`express server listening on ${PORT}`);
})


const io = socket(server, {
    cors : {
        origin : "*",
        methods : ["GET", "POST"]
    }
})

const peers = [];

io.on('connection', (socket)=>{
    socket.emit('socketConnectionStart', null);
    console.log("new user connected !", socket.id)
    // console.log("socket.io ", socket)

    socket.on('register-new-user', (data)=>{
        peers.push({
            username: data.username,
            socket: data.socketId
        })
        console.log('registed new user');
        console.log(peers);
    })
})