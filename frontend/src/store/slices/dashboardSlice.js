import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    userName : "Bob",
    counter : 0
}

export const dashboardSlice = createSlice({
    name : "dashboard",
    initialState,
    reducers: {
        setUserName : (state, action) => {
            state.userName = action.payload
        },
        increaseCounter : (state, action) => {
            state.counter++;
        }
    }
})

export const  { setUserName, increaseCounter } = dashboardSlice.actions;
export default dashboardSlice.reducer;