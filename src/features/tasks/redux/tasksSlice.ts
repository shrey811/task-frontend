import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../../types/task';

interface TasksState {
    searchQuery: string;
    sortByPriority: boolean;
}

const initialState: TasksState = {
    searchQuery: '',
    sortByPriority: true,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        toggleSortByPriority: (state) => {
            state.sortByPriority = !state.sortByPriority;
        },
    },
});

export const { setSearchQuery, toggleSortByPriority } = tasksSlice.actions;
export default tasksSlice.reducer;