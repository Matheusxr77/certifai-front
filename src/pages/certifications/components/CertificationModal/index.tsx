import React from 'react';
import { 
    FiX, 
    FiSave, 
    FiLoader } from 'react-icons/fi';
import { 
    CERTIFICATIONS_CONSTANTS, 
    DIFFICULTY_OPTIONS,
} from '../../indexModel';
import { CERTIFICATION_MODAL_CONSTANTS } from './indexModel';
import { useCertificationModalController } from './indexController';
import './styles.css';

import type { DifficultyLevel } from '../../indexModel';
import type { CertificationModalProps } from './indexModel';

const CertificationModal: React.FC<CertificationModalProps> = ({
    isOpen,
    isEdit,
    certification,
    onSave,
    onClose
}) => {
    const {
        formData,
        isLoading,
        errors,
        handleSubmit,
        handleOverlayClick,
        setFormData
    } = useCertificationModalController({
        isOpen,
        isEdit,
        certification,
        onSave,
        onClose
    });

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEdit ? CERTIFICATIONS_CONSTANTS.EDIT_MODAL_TITLE : CERTIFICATIONS_CONSTANTS.CREATE_MODAL_TITLE}
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

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nome">{CERTIFICATIONS_CONSTANTS.NAME_LABEL} *</label>
                            <input
                                type="text"
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                placeholder={CERTIFICATIONS_CONSTANTS.NAME_PLACEHOLDER}
                                className={errors.nome ? 'error' : ''}
                                disabled={isLoading}
                                maxLength={100}
                            />
                            {errors.nome && <span className="error-text">{errors.nome}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="dificuldade">{CERTIFICATIONS_CONSTANTS.DIFFICULTY_LABEL} *</label>
                            <select
                                id="dificuldade"
                                value={formData.dificuldade}
                                onChange={(e) => setFormData(prev => ({ ...prev, dificuldade: e.target.value as DifficultyLevel }))}
                                className={errors.dificuldade ? 'error' : ''}
                                disabled={isLoading}
                            >
                                <option value="">{CERTIFICATION_MODAL_CONSTANTS.SELECT_DIFFICULTY}</option>
                                {DIFFICULTY_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.dificuldade && <span className="error-text">{errors.dificuldade}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="tempo">{CERTIFICATIONS_CONSTANTS.TIME_LABEL}</label>
                            <input
                                type="number"
                                id="tempo"
                                value={formData.tempo || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    tempo: e.target.value ? parseInt(e.target.value) : undefined 
                                }))}
                                placeholder={CERTIFICATIONS_CONSTANTS.TIME_PLACEHOLDER}
                                className={errors.tempo ? 'error' : ''}
                                disabled={isLoading}
                                min={1}
                            />
                            {errors.tempo && <span className="error-text">{errors.tempo}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="descricao">{CERTIFICATIONS_CONSTANTS.DESCRIPTION_LABEL}</label>
                            <textarea
                                id="descricao"
                                value={formData.descricao}
                                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                placeholder={CERTIFICATIONS_CONSTANTS.DESCRIPTION_PLACEHOLDER}
                                className={errors.descricao ? 'error' : ''}
                                disabled={isLoading}
                                rows={4}
                            />
                            {errors.descricao && <span className="error-text">{errors.descricao}</span>}
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
                            type="submit" 
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="spinning" />
                                    {isEdit ? CERTIFICATIONS_CONSTANTS.UPDATING_BUTTON_TEXT : CERTIFICATIONS_CONSTANTS.CREATING_BUTTON_TEXT}
                                </>
                            ) : (
                                <>
                                    <FiSave />
                                    {CERTIFICATIONS_CONSTANTS.SAVE_BUTTON_TEXT}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CertificationModal;