import { setActiveUsers } from '../../store/slices/dashboardSlice';
import { store } from "../../store/store";

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
        console.log("broadcast event happened FE")
        handleBroadcastEvent(data);
    })
}

export const registerNewUser = (username) =>{
    socket.emit('register-new-user', {
        username : username,
        socketId:socket.id
    })
}

const handleBroadcastEvent = (data) =>{
    switch (data.event) {
        case broadcastEventTypes.ACTIVE_USERS :
            console.log("inside FE wss connection", data.activeUsers)
            const activeUsers = data.activeUsers.filter((activeUser)=> activeUser.socketId !== socket.id)
            store.dispatch(setActiveUsers(activeUsers));
            break;
        
        default:
            break;
    }
}