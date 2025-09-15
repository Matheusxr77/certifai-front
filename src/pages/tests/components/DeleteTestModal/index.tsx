import React from 'react';
import { FiX, FiTrash2, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { useDeleteTestModalController } from './indexController';
import { DELETE_TEST_MODAL_CONSTANTS } from './indexModel';
import { TESTS_CONSTANTS, STATUS_OPTIONS } from '../../indexModel';
import './styles.css';

import type { DeleteTestModalProps } from './indexModel';

const DeleteTestModal: React.FC<DeleteTestModalProps> = ({
    isOpen,
    test,
    onDelete,
    onClose
}) => {
    const {
        isLoading,
        handleDelete,
        handleOverlayClick
    } = useDeleteTestModalController({
        isOpen,
        test,
        onDelete,
        onClose
    });

    if (!isOpen) return null;

    return (
        <div className="tests-modal-overlay" onClick={handleOverlayClick}>
            <div className="tests-modal-container tests-delete-modal">
                <div className="tests-modal-header">
                    <h2 className="tests-modal-title">
                        <FiTrash2 className="tests-modal-title-icon" />
                        {TESTS_CONSTANTS.DELETE_MODAL_TITLE}
                    </h2>
                    <button
                        className="tests-close-button"
                        onClick={onClose}
                        type="button"
                        disabled={isLoading}
                    >
                        <FiX />
                    </button>
                </div>
                <div className="tests-modal-content">
                    <div className="tests-warning-section">
                        <FiAlertTriangle className="tests-warning-icon" />
                        <div className="tests-warning-content">
                            <p>
                                {DELETE_TEST_MODAL_CONSTANTS.CONFIRM_MESSAGE} <strong>"{test?.certificacao?.nome}"</strong>?
                            </p>
                            <p className="tests-warning-text">
                                {TESTS_CONSTANTS.DELETE_CONFIRMATION_TEXT}
                            </p>
                        </div>
                    </div>
                    <div className="tests-info">
                        <div className="tests-info-item">
                            <span className="tests-info-label">{DELETE_TEST_MODAL_CONSTANTS.INFO_LABELS.CERTIFICATION}</span>
                            <span className="tests-info-value">{test?.certificacao?.nome}</span>
                        </div>
                        <div className="tests-info-item">
                            <span className="tests-info-label">{DELETE_TEST_MODAL_CONSTANTS.INFO_LABELS.SCORE}</span>
                            <span className="tests-info-value">{test.pontuacao}</span>
                        </div>
                        <div className="tests-info-item">
                            <span className="tests-info-label">{DELETE_TEST_MODAL_CONSTANTS.INFO_LABELS.TIME}</span>
                            <span className="tests-info-value">{test.tempo} min</span>
                        </div>
                        <div className="tests-info-item">
                            <span className="tests-info-label">{DELETE_TEST_MODAL_CONSTANTS.INFO_LABELS.STATUS}</span>
                            <span className="tests-info-value">
                                {STATUS_OPTIONS.find(opt => opt.value === test.status)?.label}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="tests-modal-actions">
                    <button
                        type="button"
                        className="tests-cancel-button"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {TESTS_CONSTANTS.CANCEL_BUTTON_TEXT}
                    </button>
                    <button
                        type="button"
                        className="tests-modal-delete-button"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FiLoader className="spinning" />
                                {TESTS_CONSTANTS.DELETING_BUTTON_TEXT}
                            </>
                        ) : (
                            <>
                                <FiTrash2 />
                                {TESTS_CONSTANTS.DELETE_BUTTON_TEXT}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTestModal;
