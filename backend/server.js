
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
let peers = [];

const broadcastEventTypes = {
    ACTIVE_USERS : 'ACTIVE_USERS',
    GROUP_CALL_ROOMS : 'GROUP_CALL_ROOMS'
}

io.on('connection', (socket)=>{
    socket.emit('socketConnection', null);
    console.log("new user connected !", socket.id)

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

    // this event occues when user closes the window / tab or handled on client side
    socket.on('disconnect', () =>{
        // remove the user from peers list
        peers = peers.filter((peer)=> peer.socketId !== socket.id);

        // send new active users list to all users
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers : peers
        })
    })

    // events listeners related to direct calls

    // receive the pre-order event from caller
    socket.on('pre-offer', (data)=>{
      console.log("pre-offer handler");

      // send event to callee 
      io.to(data.callee.socketId).emit('pre-offer', {
        callerUsername: data.caller.username,
        callerSocketId: socket.id
      })
    })

    
    socket.on('pre-offer-answer', (data)=>{
        console.log('handling pre offer answer');
        io.to(data.callerSocketId).emit('pre-offer-answer', {
            answer : data.answer
        })
    })

})