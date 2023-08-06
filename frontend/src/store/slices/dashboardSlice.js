import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    username : "",
    activeUsers : []
}

export const dashboardSlice = createSlice({
    name : "dashboard",
    initialState,
    reducers: {
        saveUserName : (state, action) => {
            state.username = action.payload
        },
        setActiveUsers: (state, action) => {
            return {
                ...state,
                activeUsers : action.payload
            }
        }
    }
})

export const  { saveUserName, setActiveUsers } = dashboardSlice.actions;
export default dashboardSlice.reducer;