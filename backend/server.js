
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

io.on('connection', (socket)=>{
    socket.emit('socketConnectionStart', null);
    console.log("new user connected !", socket.id)
    // console.log("socket.io ", socket)
})