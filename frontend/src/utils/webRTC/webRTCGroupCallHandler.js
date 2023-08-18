import * as wss from "../wssConnection/wssConnection";
import {store} from "../../store/store";
import { callStates, setCallState, setGroupCallActive, setGroupCallIncomingStreams, clearGroupCallData } from "../../store/slices/callSlice";


let myPeer;
let myPeerId;
let groupCallRoomId;

export const connectWithMyPeer = () => {
    // Peer object we have imported in index.html file, so it gets added to windows Object
    
    myPeer = new window.Peer(undefined, { // first argument we can pass our own id, but if we pass undefined then Peer server will create Ids itself
        path: '/peerjs', // same path that we have added in backend
        host: '/',
        port: 5000 // express app port
    });

    // start connection with Peer server
    myPeer.on('open', (id) => {
        console.log("Successfully connected with peer server");
        console.log(id);
        myPeerId = id;
    })

    // somebody want to join the call
    myPeer.on('call', call => {
        call.answer(store.getState().call.localStream);
        call.on('stream', incomingStream => {
            const streams = store.getState().call.groupCallStreams;

            // check if incoming stream is not present in groupCallStreams
            const stream = streams.find((stream) => stream.id === incomingStream.id);

            if(!stream){ // if incoming stream not present then add it to groupCallStreams
                addVideoStream(incomingStream);
            }
        })
    })
}

export const createNewGroupCall = () =>{
    wss.registerGroupCall({
        username: store.getState().dashboard.username,  
        peerId: myPeerId
    })

    // group call started
    store.dispatch(setGroupCallActive(true));

    // while in group call, we are not able to call anybody from the list and also nobody would be able to call us
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
}

export const joinGroupCall = (hostSocketId, roomId) =>{
    const localStream = store.getState().call.localStream;
    groupCallRoomId = roomId;

    wss.userWantsToJoinGroupCall({
        peerId: myPeerId,
        hostSocketId,
        roomId,
        localStreamId : localStream.id
    });

    // group call started
    store.dispatch(setGroupCallActive(true));

    // while in group call, we are not able to call anybody from the list and also nobody would be able to call us
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS)); 
}

export const connectToNewUser = (data) =>{
    const localStream = store.getState().call.localStream;

    const call = myPeer.call(data.peerId, localStream);
    call.on('stream', (incomingStream)=>{
        const streams = store.getState().call.groupCallStreams;

        // check if incoming stream is not present in groupCallStreams
        const stream = streams.find((stream) => stream.id === incomingStream.id);

        if(!stream){ // if incoming stream not present then add it to groupCallStreams
            addVideoStream(incomingStream);
        }
    })
}

export const leaveGroupCall = () => {
    wss.userLeftGroupCall({
        streamId: store.getState().call.localStream.id,
        roomId: groupCallRoomId
    });

    groupCallRoomId = null;
    store.dispatch(clearGroupCallData());
    myPeer.destroy();

    // start new peer connection
    connectWithMyPeer();
}

export const removeInactiveStream = (data) => {
    // filter out inactive user stream
    const groupCallStreams = store.getState().call.groupCallStreams.filter(stream => stream.id !== data.streamId);

    // update group call streams in local
    store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
}

const addVideoStream = (incomingStream) =>{
    const groupCallStreams = [
        ...store.getState().call.groupCallStreams,
        incomingStream
    ]
    store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
}