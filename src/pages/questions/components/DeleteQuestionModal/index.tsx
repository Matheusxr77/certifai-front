import React from 'react';
import { FiX } from 'react-icons/fi';
import { QUESTIONS_CONSTANTS } from '../../indexModel';
import type { DeleteQuestionModalProps } from './indexModel.tsx';

import './styles.css';

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({
    isOpen,
    questao,
    onDelete,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-delete-question-overlay">
            <div className="modal-delete-question-container">
                <div className="modal-delete-question-header">
                    <h2 className="modal-delete-question-title">{QUESTIONS_CONSTANTS.DELETE_MODAL_TITLE}</h2>
                    <button className="modal-delete-question-close-button" onClick={onClose} type="button">
                        <FiX />
                    </button>
                </div>
                <div className="modal-delete-question-content">
                    <p>{QUESTIONS_CONSTANTS.CONFIRM_DELETE_MESSAGE}</p>
                    <p>{QUESTIONS_CONSTANTS.DELETE_CONFIRMATION_TEXT}</p>
                    <div className="modal-delete-question-info">
                        <strong>{QUESTIONS_CONSTANTS.ENUNCIADO_LABEL}:</strong> {questao.enunciado}
                    </div>
                </div>
                <div className="modal-delete-question-actions">
                    <button type="button" className="modal-delete-question-cancel-button" onClick={onClose}>
                        {QUESTIONS_CONSTANTS.CANCEL_BUTTON_TEXT}
                    </button>
                    <button type="button" className="modal-delete-question-delete-button" onClick={onDelete}>
                        {QUESTIONS_CONSTANTS.DELETE_BUTTON_TEXT}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteQuestionModal;