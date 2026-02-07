import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, TaskResponse } from '../../redux/tasksApi';
import { Task } from '../../../../types/task';
import socket from '../../../../services/socket';
import { toast } from 'react-toastify';
import { PRIORITY_ORDER } from '../../../../constants/priority';
import { ApiError } from '../../../../types/errors';
import TaskTable from './TaskTable';
import TaskModal from '../ui/TaskModal';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';


const ITEMS_PER_PAGE_DEFAULT = 10;

const TaskList: React.FC = () => {
    const { data: tasks = [], isLoading, error } = useGetTasksQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [localTasks, setLocalTasks] = useState<Task[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);

    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const isInitialized = useRef(false);

    // Initialize localTasks from API data only once on mount
    useEffect(() => {
        if (!isInitialized.current && tasks.length > 0) {
            setLocalTasks(tasks);
            isInitialized.current = true;
        }
    }, [tasks]);

    useEffect(() => {
        const handleTaskCreated = (newTask: Task) => {
            console.log('🔔 Socket.IO: Received taskCreated event', newTask);
            setLocalTasks((prev) => {
                // Check if task already exists to prevent duplicates
                if (prev.some((t) => t.id === newTask.id)) {
                    console.log('Task already exists, skipping duplicate');
                    return prev;
                }
                const updated = [...prev, newTask];
                updated.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
                return updated;
            });
        };
        const handleTaskUpdated = (updatedTask: Task) => {
            console.log('🔔 Socket.IO: Received taskUpdated event', updatedTask);
            setLocalTasks((prev) => {
                const exists = prev.some((t) => t.id === updatedTask.id);
                if (!exists) {
                    // If task doesn't exist, add it (might be from another user)
                    const updated = [...prev, updatedTask];
                    updated.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
                    return updated;
                }
                // Update existing task
                return prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
            });
        };

        socket.on('taskCreated', handleTaskCreated);
        socket.on('taskUpdated', handleTaskUpdated);

        return () => {
            socket.off('taskCreated', handleTaskCreated);
            socket.off('taskUpdated', handleTaskUpdated);
        };
    }, []);

    const filteredTasks = useMemo(() => {
        let filtered = localTasks.filter(
            (task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filtered.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
        return filtered;
    }, [localTasks, searchQuery]);

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredTasks.slice(startIndex, endIndex);
    }, [filteredTasks, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
    };

    const handleSubmit = async (formData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const response: TaskResponse = await createTask(formData).unwrap();
            toast.success(response.message);
            // Don't manually add task here - let the socket event handle it
            // This prevents duplicates when the backend emits the socket event
            setModalIsOpen(false);
        } catch (err: unknown) {
            const apiError = err as ApiError;
            toast.error(apiError?.message || 'Failed to create task');
        }
    };

    const handleUpdate = async (formData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!editingTask) return;
        try {
            const response: TaskResponse = await updateTask({ id: editingTask.id, updates: formData }).unwrap();
            toast.success(response.message);
            // Don't manually update here - let the socket event handle it
            // This ensures consistency across all connected clients
            setModalIsOpen(false);
        } catch (err: unknown) {
            const apiError = err as ApiError;
            toast.error(apiError?.message || 'Failed to update task');
        }
    };

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;

        try {
            const response: { message: string } = await deleteTask(taskToDelete.id).unwrap();
            toast.success(response.message);

            const willBeEmpty = paginatedTasks.length === 1;
            const willNeedPageAdjustment = willBeEmpty && currentPage > 1;

            setLocalTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
            setDeleteModalOpen(false);
            setTaskToDelete(null);

            if (willNeedPageAdjustment) {
                setCurrentPage(currentPage - 1);
            }
        } catch (err: unknown) {
            const apiError = err as ApiError;
            toast.error(apiError?.message || 'Failed to delete task');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>;
    if (error) return <div className="text-red-500">Error: {(error as ApiError)?.message}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Task Management Dashboard</h1>
                    <button
                        onClick={() => setModalIsOpen(true)}
                        className="w-full sm:w-auto bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-green-600 transition-colors"
                    >
                        Create Task
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search by title or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 sm:p-4 border rounded-full mb-4 sm:mb-6 md:mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <TaskTable
                    tasks={paginatedTasks}
                    onEdit={(task) => {
                        setEditingTask(task);
                        setModalIsOpen(true);
                    }}
                    onDelete={handleDeleteClick}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    totalItems={filteredTasks.length}
                />
                <TaskModal
                    isOpen={modalIsOpen}
                    onClose={() => {
                        setModalIsOpen(false);
                        setEditingTask(null);
                    }}
                    task={editingTask}
                    onSubmit={editingTask ? handleUpdate : handleSubmit}
                />
                <DeleteConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    task={taskToDelete}
                />
            </div>
        </div>
    );
};

export default TaskList;