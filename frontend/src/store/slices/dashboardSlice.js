import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    username : "",
    activeUsers : [],
    groupCallRooms : []
}

export const dashboardSlice = createSlice({
    name : "dashboard",
    initialState,
    reducers: {
        saveUserName : (state, action) => {
            return {
                ...state,
                username : action.payload
            }
        },
        setActiveUsers: (state, action) => {
            return {
                ...state,
                activeUsers : action.payload
            }
        },
        setGroupCallRooms : (state, action) =>{
            return {
                ...state,
                groupCallRooms : action.payload 
            }
        }
    }
})

export const  { saveUserName, setActiveUsers, setGroupCallRooms } = dashboardSlice.actions;
export default dashboardSlice.reducer;