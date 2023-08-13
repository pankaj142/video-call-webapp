import { store } from "../../store/store";
import {
  setLocalStream,
  setCallState,
  callStates,
  setCallingDialogVisibile,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  setScreenSharingActive
} from "../../store/slices/callSlice";
import * as wss from "../wssConnection/wssConnection";

const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE", // if 1) user not get access to local stream or 2) callState will be different that CALL_AVAILABLE
};

const defaultConstrains = {
  video: true,
  audio: true,
};

// configuration related to RTCConnection
let configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:13902' // free stun server url
  }]
}

let connectedUserSocketId;
// for caller => hold socketId of callee
// for callee => hold socketID of caller

let peerConnection;

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

        console.log("senders", senders);
    
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
  // make remoteStream to null
  store.dispatch(setRemoteStream(null));

  // after making remoteStream null, still our peer connection will be connected with other peer
  // we cannot see him, but still he continues to send us stream
  // so, now we need to close our peer connection
  peerConnection.close(); // after closing peer connection, we disconnect with other user
  peerConnection = null;

  // now we create new connection, so that other user can see us for call
  createPeerConnection();

  resetCallData();

  if(store.getState().call.screenSharingActive){
    // if screen sharing was active when we hang up, then we need to stop the video stream tracks (in screen sharing tracks)
    screenSharingStream.getTracks().forEach((track)=>{
      track.stop();
    })

  }
}

export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
}