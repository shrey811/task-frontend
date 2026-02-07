import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task } from '../../../types/task';
export interface TaskResponse {
    task: Task;
    message: string;
}

export const tasksApi = createApi({
    reducerPath: 'tasksApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000' }),
    tagTypes: ['Tasks'],
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], void>({
            query: () => '/tasks',
            providesTags: ['Tasks'],
        }),
        getTaskById: builder.query<Task, string>({
            query: (id) => `/tasks/${id}`,
            providesTags: (result, error, id) => [{ type: 'Tasks', id }],
        }),
        createTask: builder.mutation<TaskResponse, Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
            query: (newTask) => ({
                url: '/tasks',
                method: 'POST',
                body: newTask,
            }),
            invalidatesTags: ['Tasks'],
        }),

        updateTask: builder.mutation<TaskResponse, {
            id: string;
            updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
        }>({
            query: ({ id, updates }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Tasks', id },
                'Tasks',
            ],
        }),
        deleteTask: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Tasks', id },
                'Tasks',
            ],
        }),
    }),
});

export const { useGetTasksQuery, useGetTaskByIdQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;