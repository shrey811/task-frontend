import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTaskByIdQuery } from '../../redux/tasksApi';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaFlag, FaInfoCircle, FaCheckCircle, FaSpinner, FaHourglassHalf } from 'react-icons/fa';
import { formatDateForDisplay } from '../../../../utils/date';

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: task, isLoading, error, isError } = useGetTaskByIdQuery(id!);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">Loading task details...</div>
                </div>
            </div>
        );
    }

    if (isError || !task) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <div className="text-xl font-bold text-gray-800 mb-2">Task Not Found</div>
                    <div className="text-gray-600 mb-6">
                        {error && 'data' in error 
                            ? (error.data as { message?: string })?.message || 'The task you are looking for does not exist.'
                            : 'The task you are looking for does not exist.'}
                    </div>
                    <Link
                        to="/tasks"
                        className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        <FaArrowLeft />
                        Back to List
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusBadge = () => {
        const statusConfig = {
            completed: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle, label: 'Completed' },
            in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaSpinner, label: 'In Progress' },
            pending: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FaHourglassHalf, label: 'Pending' },
        };
        const config = statusConfig[task.status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                <Icon className="animate-spin-slow" style={task.status === 'in_progress' ? {} : { animation: 'none' }} />
                {config.label}
            </span>
        );
    };

    const getPriorityBadge = () => {
        const priorityConfig = {
            high: { bg: 'bg-red-100', text: 'text-red-800', label: 'High Priority' },
            medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium Priority' },
            low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low Priority' },
        };
        const config = priorityConfig[task.priority] || priorityConfig.medium;
        return (
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                <FaFlag />
                {config.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/tasks"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors font-medium"
                >
                    <FaArrowLeft />
                    <span>Back to Tasks</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-8 text-white">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{task.title}</h1>
                        <div className="flex flex-wrap gap-3">
                            {getStatusBadge()}
                            {getPriorityBadge()}
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <FaInfoCircle className="text-blue-600 text-xl" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {task.description || <span className="text-gray-400 italic">No description provided</span>}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <FaCalendarAlt className="text-purple-600 text-xl" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Execution Date</h3>
                                </div>
                                <p className="text-gray-700 font-medium text-lg">
                                    {formatDateForDisplay(task.executionDateTime)}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <FaClock className="text-green-600 text-xl" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Created At</h3>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    {formatDateForDisplay(task.createdAt)}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <FaClock className="text-orange-600 text-xl" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Last Updated</h3>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    {formatDateForDisplay(task.updatedAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4 border-t border-gray-200">
                            <Link
                                to="/tasks"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <FaArrowLeft />
                                Back to Task List
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;