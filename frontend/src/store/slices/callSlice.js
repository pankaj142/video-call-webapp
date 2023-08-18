import { createSlice } from '@reduxjs/toolkit'; 

export const callStates =  {
    CALL_UNAVAILABLE : 'CALL_UNAVAILABLE', // when current user don't have access to local stream, so other users cannot call current user
    CALL_AVAILABLE : 'CALL_AVAILABLE',  // if current user has access to local stream, other user can call current user
    CALL_REQUESTED : 'CALL_REQUESTED',
    CALL_IN_PROGRESS : 'CALL_IN_PROGRESS'
}  

const initialState = {
    localStream : null,
    callState : callStates.CALL_UNAVAILABLE,
    callingDialogVisible: false,
    callerUsername: '',
    callRejected: {
        rejected : false,
        reason: ''
    },
    remoteStream : null,
    localCameraEnabled: true,
    localMicrophoneEnabled: true,
    screenSharingActive: false,
    groupCallActive: false,
    groupCallStreams: []
}
 

export const callSlice = createSlice({
    name : "call",
    initialState,
    reducers: {
        setLocalStream: (state, action) => {
            return {
                ...state,
                localStream : action.payload
            }
        },
        setCallState : (state, action) => {
            return {
                ...state,
                callState: action.payload
            }
        },
        setCallingDialogVisibile : (state, action) =>{
            return {
                ...state,
                callingDialogVisible : action.payload
            }
        },
        setCallerUsername : (state, action) =>{
            return {
                ...state,
                callerUsername: action.payload
            }
        },
        setCallRejected: (state, action) =>{
            return {
                ...state,
                callRejected: action.payload
            }
        },
        setRemoteStream: (state, action) => {
            return {
                ...state,
                remoteStream: action.payload
            }
        },
        setLocalMicrophoneEnabled: (state, action) =>{
            return {
                ...state,
                localMicrophoneEnabled: action.payload
            }
        },
        setLocalCameraEnabled: (state, action) =>{
            return {
                ...state,
                localCameraEnabled: action.payload
            }
        },
        setScreenSharingActive: (state, action) =>{
            return {
                ...state,
                screenSharingActive: action.payload
            }
        },
        resetCallDataState: (state, action) =>{
            return {
                ...state,
                remoteStream: null,
                screenSharingActive: false,
                callerUsername: '',
                localCameraEnabled: true,
                localMicrophoneEnabled: true,
                callingDialogVisible: false
            }
        },
        setGroupCallActive : (state, action) =>{
            return {
                ...state,
                groupCallActive: action.payload
            }
        },
        setGroupCallIncomingStreams : (state, action) =>{
            return {
                ...state,
                groupCallStreams : action.payload
            }
        },
        clearGroupCallData : (state, action) => {
            return {
                ...state,
                groupCallActive: false,
                groupCallStreams: [],
                callState: callStates.CALL_AVAILABLE,
                localCameraEnabled: true,
                localMicrophoneEnabled: true
            }
        }
    }
})

export const  { setLocalStream, setCallState, setCallingDialogVisibile, setCallerUsername, setCallRejected, setRemoteStream, setLocalMicrophoneEnabled, setLocalCameraEnabled,setScreenSharingActive, resetCallDataState, setGroupCallActive, setGroupCallIncomingStreams, clearGroupCallData } = callSlice.actions;
export default callSlice.reducer;