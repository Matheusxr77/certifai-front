import { 
    FiX, 
    FiUser, 
    FiMail, 
    FiShield, 
    FiAlertCircle, 
    FiCheck 
} from 'react-icons/fi';
import { useEditUserModalController } from './indexController';
import { ROLE_OPTIONS } from '../../indexModel';
import './styles.css';

import type { EditUserModalProps } from './indexModel';

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onUpdate, onClose }) => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        handleOverlayClick
    } = useEditUserModalController(user, onUpdate, onClose);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        <FiUser className="modal-title-icon" />
                        Editar Usuário
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
                    <form className="edit-user-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">
                                    <FiUser /> Nome Completo
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Digite o nome completo"
                                    disabled={true}
                                    required
                                    readOnly
                                />
                                {errors.name && (
                                    <span className="field-error">{errors.name}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">
                                    <FiMail /> Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Digite o email"
                                    disabled={true}
                                    required
                                    readOnly
                                />
                                {errors.email && (
                                    <span className="field-error">{errors.email}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">
                                <FiShield /> Perfil de Usuário
                            </label>
                            <select
                                id="role"
                                className={`form-select ${errors.role ? 'error' : ''}`}
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                disabled={isLoading}
                                required
                            >
                                <option value="">Selecione um perfil</option>
                                {ROLE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <span className="field-error">{errors.role}</span>
                            )}
                        </div>

                        <div className="switch-group">
                            <label className="switch-label">
                                <FiCheck />
                                Status do Usuário
                            </label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                    disabled={isLoading}
                                />
                                <span className="switch-slider"></span>
                            </label>
                        </div>

                        {errors.general && (
                            <div className="error-message">
                                <FiAlertCircle />
                                {errors.general}
                            </div>
                        )}
                    </form>
                </div>

                <div className="modal-actions">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="loading-spinner"></div>
                                Salvando...
                            </>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;