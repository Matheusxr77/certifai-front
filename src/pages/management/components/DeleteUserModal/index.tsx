import React, { useEffect } from 'react';
import { 
    FiX, 
    FiTrash2, 
    FiMail, 
    FiShield, 
    FiAlertTriangle 
} from 'react-icons/fi';
import { useDeleteUserModalController } from './indexController';
import { ROLE_OPTIONS } from '../../indexModel';
import './styles.css';

import type { DeleteUserModalProps } from './indexModel';

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ user, onClose, onDelete }) => {
    const {
        isLoading,
        error,
        handleDelete
    } = useDeleteUserModalController(user, onDelete, onClose);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getRoleLabel = (role: string) => {
        return ROLE_OPTIONS.find(option => option.value === role)?.label || role;
    };

    const getRoleClass = (role: string) => {
        const roleClasses = {
            ADMIN: 'role-admin',
            PROFESSOR: 'role-professor',
            STUDENT: 'role-student'
        };
        return roleClasses[role as keyof typeof roleClasses] || 'role-default';
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        <FiTrash2 className="modal-title-icon" />
                        Excluir Usuário
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
                            <h3>Atenção!</h3>
                            <p>
                                Esta ação não pode ser desfeita. O usuário será removido permanentemente 
                                do sistema junto com todos os seus dados.
                            </p>
                        </div>
                    </div>

                    <div className="user-info-card">
                        <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <h3 className="user-name">{user.name}</h3>
                            <div className="user-info-row">
                                <FiMail className="info-icon" />
                                <span>{user.email}</span>
                            </div>
                            <div className="user-info-row">
                                <FiShield className="info-icon" />
                                <span className={`role-badge ${getRoleClass(user.role)}`}>
                                    {getRoleLabel(user.role)}
                                </span>
                            </div>
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
                        Cancelar
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
                                Excluindo...
                            </>
                        ) : (
                            <>
                                <FiTrash2 />
                                Excluir
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;