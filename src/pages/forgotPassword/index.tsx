import './styles.css';
import { 
    FiMail, 
    FiLoader,
    FiCheckCircle,
    FiArrowLeft
} from 'react-icons/fi';
import { useForgotPasswordController } from './indexController';
import { FORGOT_PASSWORD_CONSTANTS } from './indexModel';

const ForgotPassword = () => {
    const {
        email,
        setEmail,
        isLoading,
        error,
        success,
        handleSubmit,
        handleBackToLogin
    } = useForgotPasswordController();

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-wrapper">
                <div className="forgot-password-container">
                    <div className="forgot-password-header">
                        <h1 className="forgot-password-title">
                            {FORGOT_PASSWORD_CONSTANTS.PAGE_TITLE}
                        </h1>
                        <p className="forgot-password-subtitle">
                            {FORGOT_PASSWORD_CONSTANTS.SUBTITLE}
                        </p>
                    </div>

                    {!success ? (
                        <form className="forgot-password-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email">
                                    {FORGOT_PASSWORD_CONSTANTS.EMAIL_LABEL}
                                </label>
                                <div className="input-with-icon">
                                    <FiMail className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={FORGOT_PASSWORD_CONSTANTS.EMAIL_PLACEHOLDER}
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
                                    disabled={isLoading || !email.trim()}
                                >
                                    {isLoading ? (
                                        <>
                                            <FiLoader className="spinning" />
                                            {FORGOT_PASSWORD_CONSTANTS.SUBMITTING_BUTTON_TEXT}
                                        </>
                                    ) : (
                                        FORGOT_PASSWORD_CONSTANTS.SUBMIT_BUTTON_TEXT
                                    )}
                                </button>

                                <button 
                                    type="button" 
                                    className="back-button"
                                    onClick={handleBackToLogin}
                                    disabled={isLoading}
                                >
                                    <FiArrowLeft />
                                    {FORGOT_PASSWORD_CONSTANTS.BACK_TO_LOGIN_TEXT}
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
                                    {FORGOT_PASSWORD_CONSTANTS.BACK_TO_LOGIN_TEXT}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;