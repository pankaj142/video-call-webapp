import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    localStream : null
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
        }
    }
})

export const  { setLocalStream } = callSlice.actions;
export default callSlice.reducer;