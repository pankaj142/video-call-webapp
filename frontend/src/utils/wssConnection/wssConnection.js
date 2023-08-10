import { setActiveUsers } from '../../store/slices/dashboardSlice';
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


const handleBroadcastEvent = (data) =>{
    switch (data.event) {
        case broadcastEventTypes.ACTIVE_USERS :
            const activeUsers = data.activeUsers.filter((activeUser)=> activeUser.socketId !== socket.id)
            store.dispatch(setActiveUsers(activeUsers));
            break;
        
        default:
            break;
    }
}