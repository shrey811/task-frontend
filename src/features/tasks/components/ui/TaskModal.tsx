import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Task } from '../../../../types/task';
import TaskForm from '../pages/TaskForm';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onSubmit: (formData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, onSubmit }) => {
    const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
        title: '', description: '', executionDateTime: '', status: 'pending', priority: 'medium',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                executionDateTime: task.executionDateTime.split('T')[0] + 'T' + task.executionDateTime.split('T')[1].slice(0, 5),
                status: task.status,
                priority: task.priority,
            });
        } else {
            setFormData({ title: '', description: '', executionDateTime: '', status: 'pending', priority: 'medium' });
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 relative z-50 outline-none max-h-[90vh] overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 backdrop-blur-sm transition-opacity p-2 sm:p-4"
            closeTimeoutMS={200}
            ariaHideApp={false}
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center"
                aria-label="Close modal"
            >
                ×
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 pr-8">{task ? 'Edit Task' : 'Create Task'}</h2>
            <TaskForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onClose={onClose} isEditing={!!task} />
        </Modal>
    );
};

export default TaskModal;