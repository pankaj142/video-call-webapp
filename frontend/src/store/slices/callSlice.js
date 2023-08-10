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
    }
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
        }
    }
})

export const  { setLocalStream, setCallState, setCallingDialogVisibile, setCallerUsername, setCallRejected } = callSlice.actions;
export default callSlice.reducer;