import { store } from "../../store/store";
import {
  setLocalStream,
  setCallState,
  callStates,
  setCallingDialogVisibile,
  setCallerUsername,
  setCallRejected
} from "../../store/slices/callSlice";
import * as wss from "../wssConnection/wssConnection";

const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE", // if 1) user not get access to local stream or 2) callState will be different that CALL_AVAILABLE
};

const configuration = {
  video: true,
  audio: true,
};

// get access to cameras and microphonec connected to the computer or smartphone
export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(configuration)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    })
    .catch((err) => {
      console.log(
        "error occured when trying to get access to local stream",
        err
      );
    });
};

// -------------------------  pre-order   ------------------------------------
let connectedUserSocketId;
// for caller => hold socketId of callee
// for callee => hold socketID of caller

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
    if(checkIfCallIsPossible){
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


export const resetCallData = () => {
    connectedUserSocketId = null;
    store.dispatch(setCallState(callStates.CALL_AVAILABLE));
}


// -------------------------  pre-order end  ------------------------------------
