
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

// active users list
const peers = [];

const broadcastEventTypes = {
    ACTIVE_USERS : 'ACTIVE_USERS',
    GROUP_CALL_ROOMS : 'GROUP_CALL_ROOMS'
}

io.on('connection', (socket)=>{
    socket.emit('socketConnection', null);
    console.log("new user connected !", socket.id)
    // console.log("socket.io ", socket)

    socket.on('register-new-user', (data)=>{
        peers.push({
            username: data.username,
            socketId: data.socketId
        })
        console.log('registed new user');
        console.log(peers);

        // send new active users list to all users
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers : peers
        })
    })
})