import { 
    useState, 
    useEffect 
} from 'react';
import { 
    useNavigate, 
    useSearchParams 
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    CONFIRMATION_CONSTANTS,
    CONFIRMATION_ERROR_MESSAGES 
} from './indexModel';

import type { 
    ConfirmationControllerReturn,
    ConfirmationErrorType 
} from './indexModel';

export const useConfirmationController = (): ConfirmationControllerReturn => {
    const [isLoading, setIsLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState(CONFIRMATION_CONSTANTS.LOADING_MESSAGE);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        
        if (token || email) {
            verifyEmail(token || undefined);
        } else {
            // Se não há token, assume que já foi verificado
            setIsLoading(false);
            setIsVerified(true);
            setMessage(CONFIRMATION_CONSTANTS.SUCCESS_MESSAGE);
        }
    }, [searchParams]);

    const verifyEmail = async (token?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Simula verificação do email
            // Em um cenário real, aqui seria feita a chamada para a API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simula sucesso na verificação baseado no token
            const isSuccess = token ? Math.random() > 0.1 : true; // 90% de chance de sucesso com token
            
            if (isSuccess) {
                setIsVerified(true);
                setMessage(CONFIRMATION_CONSTANTS.SUCCESS_MESSAGE);
                toast.success('E-mail verificado com sucesso!');
            } else {
                throw new Error('INVALID_TOKEN');
            }
        } catch (error) {
            const errorType = (error as Error).message as ConfirmationErrorType;
            const errorMessage = getErrorMessage(errorType);
            
            setError(errorMessage);
            setIsVerified(false);
            setMessage(CONFIRMATION_CONSTANTS.ERROR_MESSAGE);
            toast.error(errorMessage);
            
        } finally {
            setIsLoading(false);
        }
    };

    const getErrorMessage = (errorType: ConfirmationErrorType): string => {
        switch (errorType) {
            case 'INVALID_TOKEN':
                return CONFIRMATION_ERROR_MESSAGES.INVALID_TOKEN;
            case 'EXPIRED_TOKEN':
                return CONFIRMATION_ERROR_MESSAGES.EXPIRED_TOKEN;
            case 'NETWORK':
                return CONFIRMATION_ERROR_MESSAGES.NETWORK_ERROR;
            case 'ALREADY_VERIFIED':
                return CONFIRMATION_ERROR_MESSAGES.ALREADY_VERIFIED;
            default:
                return CONFIRMATION_ERROR_MESSAGES.UNKNOWN_ERROR;
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const clearError = () => {
        setError(null);
    };

    return {
        isLoading,
        isVerified,
        error,
        message,
        handleLoginClick,
        verifyEmail,
        clearError
    };
};