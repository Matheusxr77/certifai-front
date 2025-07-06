import './styles.css';
import { 
    FiCheckCircle, 
    FiXCircle, 
    FiLoader 
} from 'react-icons/fi';
import { useConfirmationController } from './indexController';

const Confirmation = () => {
    const { 
        isLoading, 
        isVerified, 
        error, 
        message, 
        handleLoginClick 
    } = useConfirmationController();

    return (
        <div className="confirmation-container">
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <h1>Verificação de E-mail</h1>
                </div>
                
                <div className="confirmation-content">
                    {isLoading && (
                        <div className="confirmation-loading">
                            <FiLoader className="loading-icon spinning" />
                            <p>{message}</p>
                        </div>
                    )}
                    
                    {!isLoading && isVerified && (
                        <div className="confirmation-success">
                            <FiCheckCircle className="success-icon" />
                            <div className="message-text">
                                {message.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {!isLoading && !isVerified && (
                        <div className="confirmation-error">
                            <FiXCircle className="error-icon" />
                            <p>{error || message}</p>
                        </div>
                    )}
                </div>
                
                <div className="confirmation-actions">
                    {!isLoading && isVerified && (
                        <button 
                            className="login-button" 
                            onClick={handleLoginClick}
                        >
                            Fazer Login
                        </button>
                    )}
                    
                    {!isLoading && !isVerified && (
                        <div className="error-actions">
                            <button 
                                className="retry-button" 
                                onClick={() => window.location.reload()}
                            >
                                Tentar Novamente
                            </button>
                            <button 
                                className="login-button secondary" 
                                onClick={handleLoginClick}
                            >
                                Ir para Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Confirmation;