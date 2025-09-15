import React from 'react';
import { FiX, FiSave, FiLoader } from 'react-icons/fi';
import { TESTS_CONSTANTS } from '../../indexModel';
import { TEST_MODAL_CONSTANTS } from './indexModel';
import { useTestModalController } from './indexController';
import './styles.css';

import type { TestModalProps } from './indexModel';

const TestModal: React.FC<TestModalProps> = ({
    isOpen,
    isEdit,
    test,
    onSave,
    onClose
}) => {
    const {
        formData,
        isLoading,
        errors,
        setFormData,
        handleSubmit,
        handleOverlayClick,
        certificacoes,
        isCertificacoesLoading
    } = useTestModalController({
        isOpen,
        isEdit,
        test,
        onSave,
        onClose,
        certificacoes: []
    });

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEdit ? TESTS_CONSTANTS.EDIT_MODAL_TITLE : TESTS_CONSTANTS.CREATE_MODAL_TITLE}
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
                                <label htmlFor="nome">{TESTS_CONSTANTS.NAME_LABEL} *</label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={formData.nome}
                                    onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                    className={errors.nome ? 'error' : ''}
                                    disabled={isLoading}
                                />
                                {errors.nome && <span className="error-text">{errors.nome}</span>}
                            </div>
                        <div className="form-group">
                            <label htmlFor="certificacaoId">{TESTS_CONSTANTS.CERTIFICATION_LABEL} *</label>
                            {isCertificacoesLoading ? (
                                <div style={{ padding: '0.5rem 0' }}>
                                    <FiLoader className="spinning" /> Carregando certificações...
                                </div>
                            ) : (
                                <select
                                    id="certificacaoId"
                                    value={formData.certificacaoId}
                                    onChange={e => setFormData(prev => ({ ...prev, certificacaoId: Number(e.target.value) }))}
                                    className={errors.certificacaoId ? 'error' : ''}
                                    disabled={isLoading}
                                >
                                    <option value="">{TEST_MODAL_CONSTANTS.SELECT_CERTIFICATION}</option>
                                    {certificacoes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            )}
                            {errors.certificacaoId && <span className="error-text">{errors.certificacaoId}</span>}
                        </div>
                        <div className={`form-group form-group-switch${formData.comTempo ? ' switch-active' : ''}`}>
                            <div className="switch-label-row">
                                <label htmlFor="comTempo">{TESTS_CONSTANTS.WITH_TIME_LABEL}</label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="comTempo"
                                        checked={formData.comTempo}
                                        onChange={e => setFormData(prev => ({ ...prev, comTempo: e.target.checked }))}
                                        disabled={isLoading}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                        {formData.comTempo && (
                            <div className="form-group">
                                <label htmlFor="tempo">{TESTS_CONSTANTS.TIME_LABEL} *</label>
                                <input
                                    type="number"
                                    id="tempo"
                                    value={formData.tempo}
                                    onChange={e => setFormData(prev => ({ ...prev, tempo: parseInt(e.target.value) }))}
                                    placeholder={TESTS_CONSTANTS.TIME_PLACEHOLDER}
                                    className={errors.tempo ? 'error' : ''}
                                    disabled={isLoading}
                                    min={1}
                                />
                                {errors.tempo && <span className="error-text">{errors.tempo}</span>}
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="numeroDeQuestoes">Número de questões *</label>
                            <input
                                type="number"
                                id="numeroDeQuestoes"
                                value={formData.numeroDeQuestoes ?? ''}
                                onChange={e => setFormData(prev => ({ ...prev, numeroDeQuestoes: parseInt(e.target.value) }))}
                                placeholder="Quantidade de questões"
                                min={1}
                                required
                                disabled={isLoading}
                            />
                            {errors.numeroDeQuestoes && <span className="error-text">{errors.numeroDeQuestoes}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="dificuldadeQuestoes">Dificuldade das questões *</label>
                            <select
                                id="dificuldadeQuestoes"
                                value={formData.dificuldadeQuestoes ?? ''}
                                onChange={e => setFormData(prev => ({ ...prev, dificuldadeQuestoes: e.target.value }))}
                                required
                                disabled={isLoading}
                            >
                                <option value="">Selecione a dificuldade</option>
                                <option value="BASICO">Básico</option>
                                <option value="INTERMEDIARIO">Intermediário</option>
                                <option value="AVANCADO">Avançado</option>
                            </select>
                            {errors.dificuldadeQuestoes && <span className="error-text">{errors.dificuldadeQuestoes}</span>}
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {TESTS_CONSTANTS.CANCEL_BUTTON_TEXT}
                        </button>
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="spinning" />
                                    {isEdit ? TESTS_CONSTANTS.UPDATING_BUTTON_TEXT : TESTS_CONSTANTS.CREATING_BUTTON_TEXT}
                                </>
                            ) : (
                                <>
                                    <FiSave />
                                    {TESTS_CONSTANTS.SAVE_BUTTON_TEXT}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default TestModal;

