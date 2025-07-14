import './styles.css';
import { 
    FiUser, 
    FiMail,
    FiLoader,
    FiCheckCircle,
    FiRefreshCw,
    FiLock,
    FiAlertTriangle,
    FiUserX
} from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useProfileController } from './indexController';
import { 
    PROFILE_CONSTANTS,
    ROLE_OPTIONS
} from './indexModel';
import Sidebar from '../../components/sidebar';
import DeleteAccountModal from './components/DeleteAccountModal/index';
import DeactivateAccountModal from './components/DeactivateAccountModal/index';

const ProfilePage: React.FC = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);
    
    const {
        profileData,
        selectedRole,
        isLoading,
        isSaving,
        error,
        success,
        handleUpdateProfile,
        handleRoleChange,
        refreshProfile,
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        isChangingPassword,
        handlePasswordChange,
        showPasswordForm,
        setShowPasswordForm,
        isDeactivating,
        showDeactivateForm,
        setShowDeactivateForm,
        showProfileForm,
        setShowProfileForm,
        isDeleting,
        showDeleteForm,
        setShowDeleteForm,
        showDeleteModal,
        setShowDeleteModal,
        handleDeleteModalClose,
        handleDeleteModalConfirm,
        showDeactivateModal,
        setShowDeactivateModal,
        handleDeactivateModalClose,
        handleDeactivateModalConfirm,
        getRoleDescription,
        getRoleLabel
    } = useProfileController();

    const toggleSidebar = () => {
        setSidebarExpanded(!isSidebarExpanded);
    };

    if (isLoading) {
        return (
            <div className="profile-container">
                <div className="profile-loading">
                    <FiLoader className="loading-icon spinning" />
                    <p>{PROFILE_CONSTANTS.LOADING_MESSAGE}</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className={`profile-container ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                <Sidebar 
                    isExpanded={isSidebarExpanded} 
                    toggleSidebar={toggleSidebar} 
                />
                <main className="main-content">
                    <div className="profile-error">
                        <p>{PROFILE_CONSTANTS.ERROR_LOADING_PROFILE}</p>
                        <button onClick={refreshProfile} className="refresh-button">
                            <FiRefreshCw />
                            {PROFILE_CONSTANTS.TRY_AGAIN_BUTTON}
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`profile-container ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
            <Sidebar 
                isExpanded={isSidebarExpanded} 
                toggleSidebar={toggleSidebar} 
            />
            <main className="main-content">
                <div className="profile-wrapper">
                    <div className="profile-header">
                        <h1 className="profile-title">{PROFILE_CONSTANTS.PAGE_TITLE}</h1>
                        <button 
                            onClick={refreshProfile} 
                            className="refresh-button"
                            disabled={isLoading}
                        >
                            <FiRefreshCw className={isLoading ? 'spinning' : ''} />
                        </button>
                    </div>

                    <div className="profile-content">
                        <div className="profile-left-section">
                            <div className="profile-form-section">
                                <div className="section-header">
                                    <h2 className="section-title">{PROFILE_CONSTANTS.PROFILE_SECTION_TITLE}</h2>
                                    <button 
                                        type="button" 
                                        className="toggle-profile-form-button"
                                        onClick={() => setShowProfileForm(!showProfileForm)}
                                        disabled={isSaving}
                                    >
                                        <FiUser />
                                        {showProfileForm 
                                            ? PROFILE_CONSTANTS.HIDE_PROFILE_FORM_TEXT 
                                            : PROFILE_CONSTANTS.SHOW_PROFILE_FORM_TEXT
                                        }
                                    </button>
                                </div>

                                {showProfileForm && (
                                    <form className="profile-form" onSubmit={handleUpdateProfile}>
                                        <div className="input-group">
                                            <label htmlFor="role">{PROFILE_CONSTANTS.ROLE_LABEL}</label>
                                            <select
                                                id="role"
                                                name="role"
                                                value={selectedRole}
                                                onChange={(e) => handleRoleChange(e.target.value)}
                                                className={error ? 'error' : ''}
                                                disabled={isSaving}
                                            >
                                                <option value="">{PROFILE_CONSTANTS.ROLE_PLACEHOLDER}</option>
                                                {ROLE_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {selectedRole && (
                                                <small className="role-description">
                                                    {getRoleDescription(selectedRole)}
                                                </small>
                                            )}
                                        </div>

                                        {error && (
                                            <div className="error-message">
                                                <p>{error}</p>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="success-message">
                                                <FiCheckCircle />
                                                <p>{success}</p>
                                            </div>
                                        )}

                                        <div className="form-actions">
                                            <button 
                                                type="submit" 
                                                className="update-button"
                                                disabled={isSaving || !selectedRole || selectedRole === profileData.role}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <FiLoader className="spinning" />
                                                        {PROFILE_CONSTANTS.UPDATING_BUTTON_TEXT}
                                                    </>
                                                ) : (
                                                    PROFILE_CONSTANTS.UPDATE_BUTTON_TEXT
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {localStorage.getItem('token') !== null &&
                                <>
                                    <div className="password-form-section">
                                        <div className="section-header">
                                            <h2 className="section-title">{PROFILE_CONSTANTS.PASSWORD_FORM_TITLE}</h2>
                                            <button 
                                                type="button" 
                                                className="toggle-password-form-button"
                                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                                disabled={isChangingPassword}
                                            >
                                                <FiLock />
                                                {showPasswordForm 
                                                    ? PROFILE_CONSTANTS.HIDE_PASSWORD_FORM_TEXT 
                                                    : PROFILE_CONSTANTS.SHOW_PASSWORD_FORM_TEXT
                                                }
                                            </button>
                                        </div>

                                        {showPasswordForm && (
                                            <form className="password-form" onSubmit={handlePasswordChange}>
                                                <div className="input-group">
                                                    <label htmlFor="currentPassword">
                                                        {PROFILE_CONSTANTS.CURRENT_PASSWORD_LABEL}
                                                    </label>
                                                    <div className="input-with-icon">
                                                        <FiLock className="input-icon" />
                                                        <input
                                                            type="password"
                                                            id="currentPassword"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                            placeholder={PROFILE_CONSTANTS.CURRENT_PASSWORD_PLACEHOLDER}
                                                            className={error ? 'error' : ''}
                                                            disabled={isChangingPassword}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="newPassword">
                                                        {PROFILE_CONSTANTS.NEW_PASSWORD_LABEL}
                                                    </label>
                                                    <div className="input-with-icon">
                                                        <FiLock className="input-icon" />
                                                        <input
                                                            type="password"
                                                            id="newPassword"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            placeholder={PROFILE_CONSTANTS.NEW_PASSWORD_PLACEHOLDER}
                                                            className={error ? 'error' : ''}
                                                            disabled={isChangingPassword}
                                                            required
                                                        />
                                                    </div>
                                                    <small className="password-hint">
                                                        {PROFILE_CONSTANTS.PASSWORD_REQUIREMENTS}
                                                    </small>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="confirmPassword">
                                                        {PROFILE_CONSTANTS.CONFIRM_PASSWORD_LABEL}
                                                    </label>
                                                    <div className="input-with-icon">
                                                        <FiLock className="input-icon" />
                                                        <input
                                                            type="password"
                                                            id="confirmPassword"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            placeholder={PROFILE_CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER}
                                                            className={error ? 'error' : ''}
                                                            disabled={isChangingPassword}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {error && (
                                                    <div className="error-message">
                                                        <p>{error}</p>
                                                    </div>
                                                )}

                                                {success && (
                                                    <div className="success-message">
                                                        <FiCheckCircle />
                                                        <p>{success}</p>
                                                    </div>
                                                )}

                                                <div className="form-actions">
                                                    <button 
                                                        type="submit" 
                                                        className="change-password-button"
                                                        disabled={isChangingPassword || !currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()}
                                                    >
                                                        {isChangingPassword ? (
                                                            <>
                                                                <FiLoader className="spinning" />
                                                                {PROFILE_CONSTANTS.CHANGING_PASSWORD_BUTTON_TEXT}
                                                            </>
                                                        ) : (
                                                            PROFILE_CONSTANTS.CHANGE_PASSWORD_BUTTON_TEXT
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </>
                            }

                            <div className="deactivate-user-section">
                                <div className="section-header">
                                    <h2 className="section-title">{PROFILE_CONSTANTS.DEACTIVATE_USER_TITLE}</h2>
                                    <button 
                                        type="button" 
                                        className="toggle-deactivate-form-button"
                                        onClick={() => setShowDeactivateForm(!showDeactivateForm)}
                                        disabled={isDeactivating}
                                    >
                                        <FiUserX />
                                        {showDeactivateForm 
                                            ? PROFILE_CONSTANTS.HIDE_DEACTIVATE_FORM_TEXT 
                                            : PROFILE_CONSTANTS.SHOW_DEACTIVATE_FORM_TEXT
                                        }
                                    </button>
                                </div>

                                {showDeactivateForm && (
                                    <div className="deactivate-form">
                                        <p className="deactivate-description">
                                            {PROFILE_CONSTANTS.DEACTIVATE_DESCRIPTION}
                                        </p>

                                        <div className="deactivate-warning">
                                            <FiAlertTriangle />
                                            <span>{PROFILE_CONSTANTS.DEACTIVATE_WARNING}</span>
                                        </div>

                                        {error && (
                                            <div className="error-message">
                                                <p>{error}</p>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="success-message">
                                                <FiCheckCircle />
                                                <p>{success}</p>
                                            </div>
                                        )}

                                        <div className="form-actions">
                                            <button 
                                                type="button" 
                                                className="deactivate-button"
                                                onClick={() => setShowDeactivateModal(true)}
                                                disabled={isDeactivating}
                                            >
                                                {isDeactivating ? (
                                                    <>
                                                        <FiLoader className="spinning" />
                                                        {PROFILE_CONSTANTS.DEACTIVATING_BUTTON_TEXT}
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiUserX />
                                                        {PROFILE_CONSTANTS.DEACTIVATE_BUTTON_TEXT}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="delete-user-section">
                                <div className="section-header">
                                    <h2 className="section-title">{PROFILE_CONSTANTS.DELETE_USER_TITLE}</h2>
                                    <button 
                                        type="button" 
                                        className="toggle-delete-form-button"
                                        onClick={() => setShowDeleteForm(!showDeleteForm)}
                                        disabled={isDeleting}
                                    >
                                        <Trash2 size={20} />
                                        {showDeleteForm 
                                            ? PROFILE_CONSTANTS.HIDE_DELETE_FORM_TEXT
                                            : PROFILE_CONSTANTS.SHOW_DELETE_FORM_TEXT
                                        }
                                    </button>
                                </div>

                                {showDeleteForm && (
                                    <div className="delete-form">
                                        <p className="delete-description">
                                            {PROFILE_CONSTANTS.DELETE_DESCRIPTION}
                                        </p>

                                        <div className="delete-warning">
                                            <FiAlertTriangle />
                                            <span>{PROFILE_CONSTANTS.DELETE_WARNING}</span>
                                        </div>

                                        {error && (
                                            <div className="error-message">
                                                <p>{error}</p>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="success-message">
                                                <FiCheckCircle />
                                                <p>{success}</p>
                                            </div>
                                        )}

                                        <div className="form-actions">
                                            <button 
                                                type="button" 
                                                className="delete-button"
                                                onClick={() => setShowDeleteModal(true)}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <>
                                                        <FiLoader className="spinning" />
                                                        {PROFILE_CONSTANTS.DELETING_BUTTON_TEXT}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 size={16} />
                                                        {PROFILE_CONSTANTS.DELETE_CONFIRMATION_BUTTON_TEXT}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="profile-right-section">
                            <div className="profile-info-section">
                                <h2 className="section-title">{PROFILE_CONSTANTS.INFO_SECTION_TITLE}</h2>
                                
                                <div className="profile-info-grid">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FiUser />
                                        </div>
                                        <div className="info-content">
                                            <label>{PROFILE_CONSTANTS.NAME_LABEL}</label>
                                            <p>{profileData.name}</p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FiMail />
                                        </div>
                                        <div className="info-content">
                                            <label>{PROFILE_CONSTANTS.EMAIL_LABEL}</label>
                                            <p>{profileData.email}</p>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FiUser />
                                        </div>
                                        <div className="info-content">
                                            <label>{PROFILE_CONSTANTS.CURRENT_ROLE_LABEL}</label>
                                            <p className="current-role">
                                                {getRoleLabel(profileData.role)}
                                            </p>
                                            <small className="role-description">
                                                {getRoleDescription(profileData.role)}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showDeactivateModal && profileData && (
                    <DeactivateAccountModal
                        user={{ ...profileData, id: String(profileData.id) }}
                        onClose={handleDeactivateModalClose}
                        onDeactivate={handleDeactivateModalConfirm}
                    />
                )}

                {showDeleteModal && profileData && (
                    <DeleteAccountModal
                        user={{ ...profileData, id: String(profileData.id) }}
                        onClose={handleDeleteModalClose}
                        onDelete={handleDeleteModalConfirm}
                    />
                )}
            </main>
        </div>
    );
};

export default ProfilePage;