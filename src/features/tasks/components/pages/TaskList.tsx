import React, { useState, useMemo, useEffect } from 'react';
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
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);

    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    useEffect(() => {
        const handleTaskCreated = (newTask: Task) => {
            setLocalTasks((prev) => {
                if (prev.some((t) => t.id === newTask.id)) return prev;
                const updated = [...prev, newTask];
                updated.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
                return updated;
            });
        };
        const handleTaskUpdated = (updatedTask: Task) => {
            setLocalTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
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
            setLocalTasks((prev) => {
                const updated = [...prev, response.task];
                updated.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
                return updated;
            });
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
            setLocalTasks((prev) => prev.map((t) => (t.id === response.task.id ? response.task : t)));
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