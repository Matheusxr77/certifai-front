import React from 'react';
import { 
    FiX, 
    FiUserX, 
    FiAlertTriangle 
} from 'react-icons/fi';
import { useDeactivateAccountModalController } from './indexController';
import { DEACTIVATE_ACCOUNT_CONSTANTS } from './indexModel';
import './styles.css';

import type { DeactivateAccountModalProps } from './indexModel';

const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({ user, onClose, onDeactivate }) => {
    const {
        isLoading,
        error,
        handleDeactivate,
        handleOverlayClick
    } = useDeactivateAccountModalController(user, onDeactivate, onClose);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        <FiUserX className="modal-title-icon" />
                        {DEACTIVATE_ACCOUNT_CONSTANTS.MODAL_TITLE}
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
                            <h3>{DEACTIVATE_ACCOUNT_CONSTANTS.WARNING_TITLE}</h3>
                            <p>{DEACTIVATE_ACCOUNT_CONSTANTS.WARNING_MESSAGE}</p>
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
                        {DEACTIVATE_ACCOUNT_CONSTANTS.CANCEL_BUTTON_TEXT}
                    </button>
                    <button 
                        type="button" 
                        className="deactivate-button"
                        onClick={handleDeactivate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner"></div>
                                {DEACTIVATE_ACCOUNT_CONSTANTS.DEACTIVATING_BUTTON_TEXT}
                            </>
                        ) : (
                            <>
                                <FiUserX />
                                {DEACTIVATE_ACCOUNT_CONSTANTS.DEACTIVATE_BUTTON_TEXT}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeactivateAccountModal;