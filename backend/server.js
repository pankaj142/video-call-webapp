
const express = require("express");
const socket = require("socket.io");
const { v4: uuidv4} = require("uuid");
const {ExpressPeerServer} = require("peer");
const  groupCallHandler = require("./groupCallHandler");
const twilio = require("twilio");
const cors = require("cors");
const dotenv = require("dotenv")

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors()); // our routes can be accessible from anywhere (from every origin)

app.get('/', (req, res)=>{
    res.send({api: 'video-call-api'}) 
})

// client calls this api for TURN credentials
app.get('/api/get-turn-data', (req, res)=>{
    try{
        const accountSid = process.env.ACCOUNT_SID;
        const authToken = process.env.AUTH_TOKEN;
        const client = twilio(accountSid, authToken)
        client.tokens.create().then((data) => {
            if(data){
                res.json({ 
                    success: true,
                    data: data.iceServers
                })
            }else{
                res.json({
                    success: true,
                    data: []
                })
            }
        }) // from token we get TURN server credentials
    }catch(err){
        return res.json({
            success: false,
            error : {
                message: 'Something went wrong while fetching ICE servers'
            }
        })
    }
    
})

const server = app.listen(PORT, ()=>{
    console.log(`express server listening on ${PORT}`);
})

// this express app has 2 connection brokers - 1) socket.io  2) peerjs server - for group call

// peerjs server - connection broker
const peerServer = ExpressPeerServer(server, {
    debug: true
})
app.use('/peerjs', peerServer);
groupCallHandler.createPeerServerListeners(peerServer);


// socket.io - connection broker
const io = socket(server, {
    cors : {
        origin : "*",
        methods : ["GET", "POST"]
    }
})

// active users list
let peers = [];

// active groups 
let groupCallRooms = [];

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

        // broacast the group call rooms to all active users
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms
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
        
        // if user disconnect (close the browser tab or window), who is the owner of a group call room, then remove that room from groupCallRooms and broacast the updated groupCallRooms to all users
        groupCallRooms = groupCallRooms.filter(room => room.socketId !== socket.id);

        // broacast the updated group call rooms to all active users
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms
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
     
    socket.on('webRTC-offer', (data)=>{
        console.log("handling webRTC offer");
        io.to(data.calleeSocketId).emit('webRTC-offer', {
            offer: data.offer
        })
    })

    socket.on('webRTC-answer', (data)=>{
        console.log('handling webRTC answer');
        io.to(data.callerSocketId).emit('webRTC-answer', {
            answer: data.answer
        })
    })

    socket.on('webRTC-candidate', (data)=>{
        console.log("handling webRTC candidate")
        io.to(data.connectedUserSocketId).emit('webRTC-candidate', {
            candidate: data.candidate
        })
    })

    socket.on('user-hanged-up', (data)=>{
        console.log('handling user hanged up');
        io.to(data.connectedUserSocketId).emit('user-hanged-up');
    })

    // Listeners related with group class
    socket.on('group-call-register', (data) => {
        const roomId = uuidv4();

        // create a new socket room for this group  
        socket.join(roomId);

        const newGroupCallRoom = {
            roomId: roomId,
            peerId: data.peerId, // peerId of room owner
            hostName: data.username, 
            socketId: socket.id  // socketId of room owner
        }

        groupCallRooms.push(newGroupCallRoom);
        // console.log("groupCallRooms", groupCallRooms)

        // broacast the group call rooms to all active users
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms
        })
    })

    socket.on('group-call-join-request', (data)=>{
        // emit event to all users of the same group call room, saying that new user has join the room
        io.to(data.roomId).emit('group-call-join-request',{
            peerId: data.peerId,
            streamId: data.localStreamId
        })

        // new user joins the group call room 
        socket.join(data.roomId);
    })

    socket.on('group-call-user-left', (data)=>{
        // leave the group call room
        socket.leave(data.roomId);

        // inform same group group call users that one user left from room 
        io.to(data.roomId).emit('group-call-user-left', {
            streamId: data.streamId
        })
    })

    socket.on('group-call-closed-by-host', (data)=>{
        // remove the closed room from groupCallRooms list, so that that room will not be visible to other users
        groupCallRooms = groupCallRooms.filter(room => room.peerId !== data.peerId);

        // broadcast updated groupCallRooms list to all users
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms
        })
    })

})