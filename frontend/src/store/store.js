import { configureStore } from '@reduxjs/toolkit';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
    reducer: {
        dashboard: dashboardSlice
    },
})

