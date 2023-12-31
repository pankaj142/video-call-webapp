import * as wss from "../wssConnection/wssConnection";
import {store} from "../../store/store";
import { callStates, setCallState, setGroupCallActive, setGroupCallIncomingStreams, clearGroupCallData } from "../../store/slices/callSlice";
import { getTurnServers } from "./TURN";


let myPeer;
let myPeerId;
let groupCallRoomId;
let groupCallHost = false; // set true if the user creates a group

export const connectWithMyPeer = () => {
    // Peer object we have imported in index.html file, so it gets added to windows Object
    
    myPeer = new window.Peer(undefined, { // first argument we can pass our own id, but if we pass undefined then Peer server will create Ids itself
        config: {
            iceServers: [...getTurnServers(), { url: 'stun:stun.1uand1.de:3478'}] // if twilio does not send turnServers in some cases, then this second item, stun server can be used (this is just random working stun server ) 
        }
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
    groupCallHost = true; // this user has created a new group
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
    if(groupCallHost){ // this user is host of this room
        // he will emit event to server that, group is cloded by group host
        wss.groupCallClosedByHost({
            peerId: myPeerId
        })
    }else{ // this user is not host, then this user will remove inactive streams
        wss.userLeftGroupCall({
            streamId: store.getState().call.localStream.id,
            roomId: groupCallRoomId
        });
    }
    clearGroupData();
}

export const clearGroupData = () => {
    groupCallRoomId = null;
    groupCallHost = false;
    store.dispatch(clearGroupCallData());
    myPeer.destroy();

    // start new peer connection
    connectWithMyPeer();

    // after group call closed, we want our local stream to have video track and audio track enabled
    const localStream = store.getState().call.localStream;
    localStream.getVideoTracks()[0].enabled = true;
    localStream.getAudioTracks()[0].enabled = true;
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

// if group call is active (user has joined some group call room) return roomId if not return false
export const checkActiveGroupCall = () => {
    if(store.getState().call.groupCallActive){
        return groupCallRoomId;
    }else{
        return false;
    }
}
