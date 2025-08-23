import React from 'react';
import { FiX, FiPlus, FiInfo } from 'react-icons/fi';
import { QUESTIONS_CONSTANTS, CATEGORIA_OPTIONS, DIFICULDADE_OPTIONS } from '../../indexModel';
import type { QuestionModalProps } from './indexModel';
import { useQuestionModalController } from './indexController';
import './styles.css';

const QuestionModal: React.FC<QuestionModalProps> = ({
    isOpen,
    isEdit,
    questao,
    onSave,
    onClose
}) => {
    const {
        formData,
        setFormData,
        handleAlternativaChange,
        addAlternativa,
        saveAlternativa,
        removeAlternativa,
        handleCreateQuestao,
        handleSubmit,
        questaoId
    } = useQuestionModalController({
        isOpen,
        isEdit,
        questao,
        onSave,
        onClose
    });

    if (!isOpen) return null;

    return (
        <div className="modal-question-overlay">
            <div className="modal-question-container">
                <div className="modal-question-header">
                    <h2 className="modal-question-title">
                        {isEdit ? QUESTIONS_CONSTANTS.EDIT_MODAL_TITLE : QUESTIONS_CONSTANTS.CREATE_MODAL_TITLE}
                    </h2>
                    <button className="modal-question-close-button" onClick={onClose} type="button">
                        <FiX />
                    </button>
                </div>
                <form className="modal-question-form" onSubmit={questaoId ? handleSubmit : handleCreateQuestao}>
                    <div className="modal-question-form-group">
                        <label>{QUESTIONS_CONSTANTS.ENUNCIADO_LABEL}</label>
                        <input
                            type="text"
                            value={formData.enunciado}
                            onChange={e => setFormData(prev => ({ ...prev, enunciado: e.target.value }))}
                            required
                            disabled={!!questaoId}
                        />
                    </div>
                    <div className="modal-question-form-row">
                        <div className="modal-question-form-group">
                            <label>{QUESTIONS_CONSTANTS.CATEGORIA_LABEL}</label>
                            <select
                                value={formData.categoria}
                                onChange={e => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
                                disabled={!!questaoId}
                            >
                                {CATEGORIA_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-question-form-group">
                            <label>{QUESTIONS_CONSTANTS.DIFICULDADE_LABEL}</label>
                            <select
                                value={formData.dificuldade}
                                onChange={e => setFormData(prev => ({ ...prev, dificuldade: e.target.value as any }))}
                                disabled={!!questaoId}
                            >
                                {DIFICULDADE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Subespaço para alternativas, só aparece se questaoId existe */}
                    {questaoId && (
                        <div className="modal-question-alternativas-section">
                            <div className="modal-question-alternativas-header">
                                <span className="modal-question-alternativas-title">
                                    {QUESTIONS_CONSTANTS.ALTERNATIVAS_LABEL}
                                    <span className="modal-question-info-icon-wrapper">
                                        <FiInfo className="modal-question-info-icon" />
                                        <span className="modal-question-info-balloon">
                                            Para cada alternativa, utilize os botões ao lado para registrar, incluir ou excluir. O registro é feito individualmente.
                                        </span>
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    className="modal-question-add-alternativa-btn"
                                    onClick={addAlternativa}
                                    title="Adicionar alternativa"
                                >
                                    <FiPlus />
                                </button>
                            </div>
                            <ul className="modal-question-alternativas-list">
                                {formData.alternativas && formData.alternativas.length > 0 ? (
                                    formData.alternativas.map((alt, idx) => (
                                        <li key={alt.id} className="modal-question-alternativa-row">
                                            <input
                                                type="text"
                                                className="modal-question-alternativa-input"
                                                value={alt.texto}
                                                onChange={e => handleAlternativaChange(idx, 'texto', e.target.value)}
                                                placeholder="Texto da alternativa"
                                                required
                                            />
                                            <select
                                                className="modal-question-alternativa-correta-select"
                                                value={alt.correta ? 'true' : 'false'}
                                                onChange={e => handleAlternativaChange(idx, 'correta', e.target.value === 'true')}
                                            >
                                                <option value="false">Incorreta</option>
                                                <option value="true">Correta</option>
                                            </select>
                                            <button
                                                type="button"
                                                className="modal-question-alternativa-remove-btn"
                                                onClick={() => removeAlternativa(idx)}
                                                title="Remover alternativa"
                                            >
                                                <FiX />
                                            </button>
                                            <button
                                                type="button"
                                                className="modal-question-save-button"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => saveAlternativa(idx)}
                                                title="Salvar alternativa"
                                            >
                                                &#x2714;
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="modal-question-alternativa-row" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                        Nenhuma alternativa cadastrada para esta questão.
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                    <div className="modal-question-actions">
                        <button type="button" className="modal-question-cancel-button" onClick={onClose}>
                            {QUESTIONS_CONSTANTS.CANCEL_BUTTON_TEXT}
                        </button>
                        <button type="submit" className="modal-question-save-button">
                            {QUESTIONS_CONSTANTS.SAVE_BUTTON_TEXT}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestionModal;