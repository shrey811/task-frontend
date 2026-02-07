import { configureStore } from '@reduxjs/toolkit';
import { tasksApi } from '../features/tasks/redux/tasksApi';
import tasksReducer from '../features/tasks/redux/tasksSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        [tasksApi.reducerPath]: tasksApi.reducer, // RTK Query reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tasksApi.middleware), // Add RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;