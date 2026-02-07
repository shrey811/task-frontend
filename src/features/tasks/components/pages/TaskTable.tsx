import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../../../../types/task';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Pagination from '../ui/Pagination';

interface TaskTableProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    totalItems: number;
}

const TaskTable: React.FC<TaskTableProps> = ({
    tasks,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
}) => {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex-1 overflow-x-auto -mx-2 sm:mx-0">
                {tasks.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center">
                        <p className="text-gray-500 text-base sm:text-lg">No tasks found</p>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Title</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Status</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Priority</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Execution Date</th>
                                <th className="py-3 px-3 sm:py-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-3 px-3 sm:py-4 sm:px-6">
                                        <Link to={`/task/${task.id}`} className="text-blue-600 hover:underline font-medium text-sm sm:text-base">
                                            {task.title}
                                        </Link>
                                        <div className="sm:hidden mt-1">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${task.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : task.status === 'in_progress'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${task.priority === 'high'
                                                ? 'bg-red-100 text-red-800'
                                                : task.priority === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 sm:py-4 sm:px-6 hidden sm:table-cell">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${task.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : task.status === 'in_progress'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 sm:py-4 sm:px-6 hidden md:table-cell">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${task.priority === 'high'
                                            ? 'bg-red-100 text-red-800'
                                            : task.priority === 'medium'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 sm:py-4 sm:px-6 text-gray-700 text-xs sm:text-sm hidden lg:table-cell">
                                        {new Date(task.executionDateTime).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-3 sm:py-4 sm:px-6">
                                        <div className="flex space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() => onEdit(task)}
                                                className="bg-blue-500 text-white p-1.5 sm:p-2 rounded hover:bg-blue-600 flex items-center justify-center transition-colors text-xs sm:text-sm"
                                                title="Edit task"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => onDelete(task)}
                                                className="bg-red-500 text-white p-1.5 sm:p-2 rounded hover:bg-red-600 flex items-center justify-center transition-colors text-xs sm:text-sm"
                                                title="Delete task"
                                            >
                                                <FaTrash />
                                            </button>
                                            <Link
                                                to={`/task/${task.id}`}
                                                className="bg-purple-500 text-white p-1.5 sm:p-2 rounded hover:bg-purple-600 flex items-center justify-center transition-colors text-xs sm:text-sm"
                                                title="View details"
                                            >
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {totalItems > 0 && (
                <div className="flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        totalItems={totalItems}
                    />
                </div>
            )}
        </div>
    );
};

export default TaskTable;