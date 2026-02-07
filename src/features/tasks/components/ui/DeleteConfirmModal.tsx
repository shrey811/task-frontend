import React from 'react';
import Modal from 'react-modal';
import { Task } from '../../../../types/task';


interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    task: Task | null;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    task,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-xl max-w-md w-full mx-2 sm:mx-4 relative z-50 outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            closeTimeoutMS={200}
            ariaHideApp={false}
        >
            <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Confirm Delete</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Are you sure you want to delete the task <strong>"{task?.title}"</strong>?
                    <br />
                    <span className="text-xs sm:text-sm text-gray-500">This action cannot be undone.</span>
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-auto bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
