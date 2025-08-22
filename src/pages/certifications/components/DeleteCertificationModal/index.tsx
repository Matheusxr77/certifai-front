import React from 'react';
import { 
    FiX, 
    FiTrash2, 
    FiLoader, 
    FiAlertTriangle 
} from 'react-icons/fi';
import { useDeleteCertificationModalController } from './indexController';
import { CERTIFICATIONS_CONSTANTS } from '../../indexModel';
import { DELETE_CERTIFICATION_MODAL_CONSTANTS } from './indexModel';
import './styles.css';

import type { DeleteCertificationModalProps } from './indexModel';

const DeleteCertificationModal: React.FC<DeleteCertificationModalProps> = ({
    isOpen,
    certification,
    onDelete,
    onClose
}) => {
    const {
        isLoading,
        handleDelete,
        handleOverlayClick
    } = useDeleteCertificationModalController({
        certification,
        onDelete,
        onClose
    });

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container delete-modal">
                <div className="modal-header">
                    <h2 className="modal-title">
                        <FiTrash2 className="modal-title-icon" />
                        {CERTIFICATIONS_CONSTANTS.DELETE_MODAL_TITLE}
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
                            <p>
                                {DELETE_CERTIFICATION_MODAL_CONSTANTS.CONFIRM_MESSAGE} <strong>"{certification.nome}"</strong>?
                            </p>
                            <p className="warning-text">
                                {CERTIFICATIONS_CONSTANTS.DELETE_CONFIRMATION_TEXT}
                            </p>
                        </div>
                    </div>

                    <div className="certification-info">
                        <div className="info-item">
                            <span className="info-label">{DELETE_CERTIFICATION_MODAL_CONSTANTS.INFO_LABELS.NAME}</span>
                            <span className="info-value">{certification.nome}</span>
                        </div>
                        {certification.descricao && (
                            <div className="info-item">
                                <span className="info-label">{DELETE_CERTIFICATION_MODAL_CONSTANTS.INFO_LABELS.DESCRIPTION}</span>
                                <span className="info-value">{certification.descricao}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-actions">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {CERTIFICATIONS_CONSTANTS.CANCEL_BUTTON_TEXT}
                    </button>
                    <button 
                        type="button" 
                        className="modal-delete-button"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FiLoader className="spinning" />
                                {CERTIFICATIONS_CONSTANTS.DELETING_BUTTON_TEXT}
                            </>
                        ) : (
                            <>
                                <FiTrash2 />
                                {CERTIFICATIONS_CONSTANTS.DELETE_BUTTON_TEXT}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCertificationModal;