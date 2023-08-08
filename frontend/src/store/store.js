import { configureStore } from '@reduxjs/toolkit';
import dashboardSlice from './slices/dashboardSlice';
import callSlice from './slices/callSlice';

export const store = configureStore({
    reducer: {
        dashboard: dashboardSlice,
        call: callSlice
    },
})

