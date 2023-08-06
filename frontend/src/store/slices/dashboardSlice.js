import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    userName : "Bob",
    counter : 0
}

export const dashboardSlice = createSlice({
    name : "dashboard",
    initialState,
    reducers: {
        saveUserName : (state, action) => {
            state.userName = action.payload
        },
        increaseCounter : (state, action) => {
            state.counter++;
        }
    }
})

export const  { saveUserName, increaseCounter } = dashboardSlice.actions;
export default dashboardSlice.reducer;