import React from 'react';
import { 
    FiX, 
    FiTrash2, 
    FiAlertTriangle 
} from 'react-icons/fi';
import { useDeleteAccountModalController } from './indexController';
import { DELETE_ACCOUNT_CONSTANTS } from './indexModel';
import './styles.css';

import type { DeleteAccountModalProps } from './indexModel';

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ user, onClose, onDelete }) => {
    const {
        isLoading,
        error,
        handleDelete,
        handleOverlayClick
    } = useDeleteAccountModalController(user, onDelete, onClose);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        <FiTrash2 className="modal-title-icon" />
                        {DELETE_ACCOUNT_CONSTANTS.MODAL_TITLE}
                    </h2>
                    <button 
                        className="close-button" 
                        onClick={onClose}
                        type="button"
                        disabled={isLoading}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="warning-section">
                        <FiAlertTriangle className="warning-icon" />
                        <div className="warning-content">
                            <h3>{DELETE_ACCOUNT_CONSTANTS.WARNING_TITLE}</h3>
                            <p>{DELETE_ACCOUNT_CONSTANTS.WARNING_MESSAGE}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <FiAlertTriangle />
                            {error}
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {DELETE_ACCOUNT_CONSTANTS.CANCEL_BUTTON_TEXT}
                    </button>
                    <button 
                        type="button" 
                        className="delete-button"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner"></div>
                                {DELETE_ACCOUNT_CONSTANTS.DELETING_BUTTON_TEXT}
                            </>
                        ) : (
                            <>
                                <FiTrash2 />
                                {DELETE_ACCOUNT_CONSTANTS.DELETE_BUTTON_TEXT}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;