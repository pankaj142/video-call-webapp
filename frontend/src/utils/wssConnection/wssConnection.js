import { setActiveUsers, setGroupCallRooms } from '../../store/slices/dashboardSlice';
import { store } from "../../store/store";
import * as webRTCHandler from "../webRTC/webRTCHandler";

import socketClient  from "socket.io-client";

const SERVER = 'http://localhost:5000';

const broadcastEventTypes = {
    ACTIVE_USERS : 'ACTIVE_USERS',
    GROUP_CALL_ROOMS : 'GROUP_CALL_ROOMS'
}

let socket;

export const connectWithWebSocket = () =>{
    socket = socketClient(SERVER);

    socket.on('socketConnection', ()=>{
        console.log("Successfully connected with wss server");
        console.log("socket.id ", socket.id)
    })

    socket.on('broadcast', (data)=>{
        handleBroadcastEvent(data);
    })

    // Listeners related with Direct call

    socket.on('pre-offer', (data)=>{
        webRTCHandler.handlePreOffer(data);
    })

    socket.on('pre-offer-answer', (data)=>{
        webRTCHandler.handlePreOfferAnswer(data)
    })

    socket.on('webRTC-offer', (data)=>{
        webRTCHandler.handleOffer(data);
    })

    socket.on('webRTC-answer', (data)=>{
        webRTCHandler.handleAnswer(data);
    })

    socket.on('webRTC-candidate', (data)=>{
        webRTCHandler.handleCandidate(data);
    })

    socket.on('user-hanged-up', () => {
        webRTCHandler.handleUserHangedUp();
    })

}

export const registerNewUser = (username) =>{
    socket.emit('register-new-user', {
        username : username,
        socketId:socket.id
    })
}

// emitting events to sever related to direct calls

// caller emits this event
export const sendPreOffer = (data) =>{
    socket.emit('pre-offer', data);
}

// callee emits this event
export const sendPreOfferAnswer = (data) => {
    console.log("sendPreOfferAnswer",data)    
    socket.emit('pre-offer-answer', data)
}

export const sendWebRTCOffer = (data) => {
    socket.emit('webRTC-offer', data);
}

export const sendWebRTCAnswer = (data) =>{
    socket.emit('webRTC-answer', data);
}

export const sendWebRTCCandidate = (data) =>{
    socket.emit('webRTC-candidate', data);
}

export const sendUserHangedUp = (data) =>{
    socket.emit('user-hanged-up', data);
}

// emmiting events related to group calls

export const registerGroupCall = (data) => {
    socket.emit('group-call-register', data);
}

const handleBroadcastEvent = (data) =>{
    switch (data.event) {
        case broadcastEventTypes.ACTIVE_USERS :
            const activeUsers = data.activeUsers.filter((activeUser)=> activeUser.socketId !== socket.id)
            store.dispatch(setActiveUsers(activeUsers));
            break;
        

        case broadcastEventTypes.GROUP_CALL_ROOMS :
            store.dispatch(setGroupCallRooms(data.groupCallRooms));
            break;

        default:
            break;
    }
}