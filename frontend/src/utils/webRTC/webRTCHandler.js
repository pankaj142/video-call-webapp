import { store } from "../../store/store";
import {
  setLocalStream,
  setCallState,
  callStates,
  setCallingDialogVisibile,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  setScreenSharingActive,
  resetCallDataState,
  setChatMessage
} from "../../store/slices/callSlice";
import * as wss from "../wssConnection/wssConnection";
import { getTurnServers } from "./TURN";

const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE", // if 1) user not get access to local stream or 2) callState will be different that CALL_AVAILABLE
};

const defaultConstrains = {
  video: {
    width:480,
    height: 360
  },
  audio: true,
};



let connectedUserSocketId;
// for caller => hold socketId of callee
// for callee => hold socketID of caller

let peerConnection;
let dataChannel;

// get access to cameras and microphonec connected to the computer or smartphone
export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
      
      // create peerConnection once localStream is available
      // for each new call, we create new peerConnection
      createPeerConnection();
    })
    .catch((err) => {
      console.log(
        "error occured when trying to get access to local stream",
        err
      );
    });
};

const createPeerConnection = () =>{

  const turnServers = getTurnServers();

  // configuration related to RTCConnection
  let configuration = {
    iceServers: [...turnServers, { url: 'stun:stun.1uand1.de:3478'}], // if twilio does not send turnServers in some cases, then this second item, stun server can be used (this is just random working stun server ) 
    iceTransportPolicy: 'relay' // so it means it only accept ICE candidates of type 'relay', and if we only accept type of 'relay' of ICE candidates, all of the connections would go through that TURN servers, so it will cost for TURN server usage.
    // we are going with low video resolution, so cost will be very less
    // you can remove this policy setting, if it cost alot
  }

  peerConnection = new RTCPeerConnection(configuration);
  const localStream = store.getState().call.localStream;

  // for audio and video tracks in localStream, will add this tracks to peerConnection
  for(const track of localStream.getTracks()){
    peerConnection.addTrack(track, localStream);
  }

  // event-1 ontrack : after webRTC connection is established, we receive tracks from other user, we will get streams, these streams will be stored in our store as remote stream.
  peerConnection.ontrack = ({streams:[stream]}) => {
    store.dispatch(setRemoteStream(stream));
    // dispatch remote stream in our store
  }

  // data channel - receiver side
  // incoming data channel messages - for receive and sending data over this peer connection
  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () =>{ 
      console.log('Peer connection is ready to receive data channel messages')
    }

    // handle received messages on data channel
    dataChannel.onmessage = (event) => {
      store.dispatch(setChatMessage({
        received: true,
        content: event.data
      }))
    }
  }

  // data channel - sender side
  dataChannel = peerConnection.createDataChannel('chat');
  dataChannel.onopen = () => {
    console.log('chat data channel successfully opened');
  }

  // event-2 onicecandidate : receive ICE candidate from stun server, we will send that ice candidates to connected user
  peerConnection.onicecandidate = (event) => {
    console.log("getting ICE candidates from STUN server")
    // send to connected user our ice candidate
    if(event.candidate){
      wss.sendWebRTCCandidate({
        candidate: event.candidate,
        connectedUserSocketId: connectedUserSocketId
      })
    }
  }

  peerConnection.onconnectionstatechange = (event) =>{
    if(peerConnection.connectionState === 'connected'){
      console.log("successfully connected with other peer");
    }
  }

}


// caller handle
export const callToOtherUser = (calleeDetails) => {
  connectedUserSocketId = calleeDetails.socketId; // store callee socketId
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
  store.dispatch(setCallingDialogVisibile(true)); // it shows CallingDialog to caller

  // send pre-offer to callee
  wss.sendPreOffer({
    callee: calleeDetails,
    caller: {
      username: store.getState().dashboard.username,
    },
  });
};


// callee handle
export const handlePreOffer = (data) => {
    if(checkIfCallIsPossible()){
        connectedUserSocketId = data.callerSocketId; // store caller socketId
        store.dispatch(setCallerUsername(data.callerUsername));
        store.dispatch(setCallState(callStates.CALL_REQUESTED)); // it shows IncomingCallDialog to callee
    }else{
        wss.sendPreOfferAnswer({
            callerSocketId : data.callerSocketId,
            answer: preOfferAnswers.CALL_NOT_AVAILABLE
        })
    }
};


export const acceptIncomingCallRequest = () => {  
    wss.sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId,
        answer: preOfferAnswers.CALL_ACCEPTED
    })
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
}


export const rejectIncomingCallRequest = () => {
    wss.sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId,
        answer: preOfferAnswers.CALL_REJECTED
    })
    resetCallData();
}

// caller handle
export const handlePreOfferAnswer = (data) =>{
    store.dispatch(setCallingDialogVisibile(false));
    if(data.answer === preOfferAnswers.CALL_ACCEPTED){
        // send webRTC offer
        sendOffer();
    }else{
        let rejectionReason;
        if(data.answer === preOfferAnswers.CALL_NOT_AVAILABLE){
            rejectionReason = "Callee is not available to pick up call now";
        }else{
            rejectionReason = "Call rejected by the callee";
        }
        store.dispatch(setCallRejected({
            rejected: true,
            reason: rejectionReason
        }))

        // reset call data
        resetCallData()
    }
} 

// send webRTC offer - caller handle
export const sendOffer = async () =>{
    // crate SDP offer 
    const offer = await peerConnection.createOffer();

    // set SDP offer as local Description
    await peerConnection.setLocalDescription(offer);

    // send this offer to callee
    wss.sendWebRTCOffer({
      calleeSocketId: connectedUserSocketId,
      offer: offer 
    })
}

// callee handle
export const handleOffer = async (data) =>{

  // callee sets offer as remote description 
  await peerConnection.setRemoteDescription(data.offer);

  // create SDP answer
  const answer  = await peerConnection.createAnswer();

  // set SDP answer as local description
  peerConnection.setLocalDescription(answer);

  wss.sendWebRTCAnswer({
    callerSocketId: connectedUserSocketId,
    answer: answer
  })
}

export const handleAnswer = async (data) =>{
  // set SDP answer as remote description
  await peerConnection.setRemoteDescription(data.answer);
}

export const handleCandidate = async (data) => {
   try{
      console.log("adding ICE candidates")
      // add the ICE candidate from remote user
      await peerConnection.addIceCandidate(data.candidate);
   }catch(err){
      console.error("error occured when trying to add received ICE candidates", err);
   }
}


export const checkIfCallIsPossible = () => {
  if (
    store.getState().call.localStream === null ||
    store.getState().call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  }
  return true;
};




let screenSharingStream;

export const switchForScreenSharingStream = async () => {
  if(!store.getState().call.screenSharingActive){ // screen is NOT shared, so, STOP camera stream sharing and start screen sharing stream
    try{
        screenSharingStream = await navigator.mediaDevices.getDisplayMedia({video: true});
        store.dispatch(setScreenSharingActive(true));
        const senders = peerConnection.getSenders(); // returns array of objects, each of which represents the RTP sender responsible for transmitting one track's (video or audio) data

        // get sender which sends video track (ie. sender with kind = video)
        // currently, this sender is sending camera video track
        const sender = senders.find(sender => sender.track.kind === screenSharingStream.getVideoTracks()[0].kind);
        
        // replace the camera video track that this sender is sending, with screen sharing video track 
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]); // this means now, we are not sending anymore streams from our camera, but stream from screen sharing stream
    }catch(err){
      console.error("error occured when trying to get screen sharing stream", err);
    }
  }else{ // screen is shared, so STOP screen sharing and start camera stream sharing
      const localStream = store.getState().call.localStream;
      const senders = peerConnection.getSenders(); // returns array of objects, each of which represents the RTP sender responsible for transmitting one track's (video or audio) data

      // find sender which sends track as our localStream video track (ie. sender with kind = video)
      // currently, this sender is sending screen sharing video track
      const sender = senders.find(sender => sender.track.kind === localStream.getVideoTracks()[0].kind);

      // now, replace the screen sharing video track, in that sender with, camera video track 
      sender.replaceTrack(localStream.getVideoTracks()[0]);

      store.dispatch(setScreenSharingActive(false)); // screen sharing is STOPPed

      // we have only replaced the sender video track, from screen video track with camera video track 
      // but the browser will be still generating that screen video stream 
      // so we need to stop the screen stream
      screenSharingStream.getTracks().forEach(track => track.stop());
  }
}

// other connected user handle
export const handleUserHangedUp = () => {
  resetCallDataAfterHangUp();
}

// disconnect call
// user who want to hang up, handle this
export const hangUp = () => {
  // send connected user hang-up event 
  wss.sendUserHangedUp({
    connectedUserSocketId : connectedUserSocketId
  })

  resetCallDataAfterHangUp();
}


export const  resetCallDataAfterHangUp = () =>{
  if(store.getState().call.screenSharingActive){
    // if screen sharing was active when we hang up, then we need to stop the video stream tracks (in screen sharing tracks)
    screenSharingStream.getTracks().forEach((track)=>{
      track.stop();
    })
  }

  // make call related data
  store.dispatch(resetCallDataState());

  // after making remoteStream null, still our peer connection will be connected with other peer
  // we cannot see him, but still he continues to send us stream
  // so, now we need to close our peer connection
  peerConnection.close(); // after closing peer connection, we disconnect with other user
  peerConnection = null;

  // now we create new connection, so that other user can see us for call
  createPeerConnection();
  resetCallData();

  const localStream = store.getState().call.localStream;
  // enable the camera manuanlly ( if caller/callee has turn off camera at the middle of the call, and later he disconneded the call, so after disconnected we will manually enable the camera here, so that for the new call camera is working ) 
  localStream.getVideoTracks()[0].enabled = true;
  // same for audio 
  localStream.getAudioTracks()[0].enabled = true;
}

export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
}

export const sendMessageUsingDataChannel = (message) =>{
  dataChannel.send(message);
}