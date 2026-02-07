import React from 'react';
import { Task } from '../../../../types/task';

interface TaskFormProps {
    formData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
    setFormData: React.Dispatch<React.SetStateAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>>;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isEditing: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ formData, setFormData, onSubmit, onClose, isEditing }) => (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm sm:text-base"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Execution Date & Time</label>
            <input
                type="datetime-local"
                value={formData.executionDateTime}
                onChange={(e) => setFormData({ ...formData, executionDateTime: e.target.value })}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
            >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="w-full sm:w-auto bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
            >
                {isEditing ? 'Update' : 'Create'}
            </button>
        </div>
    </form>
);

export default TaskForm;