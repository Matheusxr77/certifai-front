import './styles.css';
import { 
    FiLock, 
    FiLoader,
    FiCheckCircle,
    FiArrowLeft,
    FiAlertTriangle
} from 'react-icons/fi';
import { useResetPasswordController } from './indexController';
import { RESET_PASSWORD_CONSTANTS } from './indexModel';

const ResetPassword = () => {
    const {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        isLoading,
        error,
        success,
        isTokenValid,
        handleSubmit,
        handleBackToLogin
    } = useResetPasswordController();

    if (!isTokenValid && !isLoading) {
        return (
            <div className="reset-password-page">
                <div className="reset-password-wrapper">
                    <div className="reset-password-container">
                        <div className="error-container">
                            <div className="error-icon">
                                <FiAlertTriangle />
                            </div>
                            <h1 className="error-title">Link Inválido</h1>
                            <p className="error-message">
                                {error || RESET_PASSWORD_CONSTANTS.TOKEN_INVALID_MESSAGE}
                            </p>
                            <button 
                                type="button" 
                                className="back-button"
                                onClick={handleBackToLogin}
                            >
                                <FiArrowLeft />
                                {RESET_PASSWORD_CONSTANTS.BACK_TO_LOGIN_TEXT}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-page">
            <div className="reset-password-wrapper">
                <div className="reset-password-container">
                    <div className="reset-password-header">
                        <h1 className="reset-password-title">
                            {RESET_PASSWORD_CONSTANTS.PAGE_TITLE}
                        </h1>
                        <p className="reset-password-subtitle">
                            {success 
                                ? RESET_PASSWORD_CONSTANTS.REDIRECT_MESSAGE
                                : RESET_PASSWORD_CONSTANTS.SUBTITLE
                            }
                        </p>
                    </div>

                    {!success ? (
                        <form className="reset-password-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="newPassword">
                                    {RESET_PASSWORD_CONSTANTS.PASSWORD_LABEL}
                                </label>
                                <div className="input-with-icon">
                                    <FiLock className="input-icon" />
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={RESET_PASSWORD_CONSTANTS.PASSWORD_PLACEHOLDER}
                                        className={error ? 'error' : ''}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <small className="password-hint">
                                    {RESET_PASSWORD_CONSTANTS.PASSWORD_REQUIREMENTS}
                                </small>
                            </div>

                            <div className="input-group">
                                <label htmlFor="confirmPassword">
                                    {RESET_PASSWORD_CONSTANTS.CONFIRM_PASSWORD_LABEL}
                                </label>
                                <div className="input-with-icon">
                                    <FiLock className="input-icon" />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder={RESET_PASSWORD_CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER}
                                        className={error ? 'error' : ''}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={isLoading || !newPassword.trim() || !confirmPassword.trim()}
                                >
                                    {isLoading ? (
                                        <>
                                            <FiLoader className="spinning" />
                                            {RESET_PASSWORD_CONSTANTS.SUBMITTING_BUTTON_TEXT}
                                        </>
                                    ) : (
                                        RESET_PASSWORD_CONSTANTS.SUBMIT_BUTTON_TEXT
                                    )}
                                </button>

                                <button 
                                    type="button" 
                                    className="back-button"
                                    onClick={handleBackToLogin}
                                    disabled={isLoading}
                                >
                                    <FiArrowLeft />
                                    {RESET_PASSWORD_CONSTANTS.BACK_TO_LOGIN_TEXT}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="success-container">
                            <div className="success-message">
                                <FiCheckCircle />
                                <p>{success}</p>
                            </div>
                            
                            <div className="success-actions">
                                <button 
                                    type="button" 
                                    className="back-button"
                                    onClick={handleBackToLogin}
                                >
                                    <FiArrowLeft />
                                    {RESET_PASSWORD_CONSTANTS.BACK_TO_LOGIN_TEXT}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;