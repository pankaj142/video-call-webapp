import socketClient  from "socket.io-client";

const SERVER = 'http://localhost:5000';

let socket;

export const connectWithWebSocket = () =>{
    socket = socketClient(SERVER);

    socket.on('socketConnectionStart', ()=>{
        console.log("Successfully connected with wss server");
        console.log("socket.id ", socket.id)
    })
}