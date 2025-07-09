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
import api from '../../api';

export const useConfirmationController = (): ConfirmationControllerReturn => {
    const [isLoading, setIsLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState(CONFIRMATION_CONSTANTS.LOADING_MESSAGE);
    const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (hasAttemptedVerification) return;

        const token = searchParams.get('token');

        if (token) {
            setHasAttemptedVerification(true);
            verifyEmail(token);
        } else {
            setIsLoading(false);
            setIsVerified(false);
            setMessage(CONFIRMATION_CONSTANTS.ERROR_MESSAGE);
        }
    }, [hasAttemptedVerification]);

    const verifyEmail = async (token?: string) => {
        if (isVerifying) return;
        setIsVerifying(true);

        try {
            setIsLoading(true);
            setError(null);
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (!token) throw new Error('INVALID_TOKEN');

            const response = await api.get(`/auth/verify?token=${token}`);

            if (response.status === 200) {
                setIsVerified(true);
                setMessage(response.data || CONFIRMATION_CONSTANTS.SUCCESS_MESSAGE);
                toast.success(response.data || 'E-mail verificado com sucesso!');
            } else {
                throw new Error('INVALID_TOKEN');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data || getErrorMessage(error.message as ConfirmationErrorType);
            setError(errorMessage);
            setIsVerified(false);
            setMessage(CONFIRMATION_CONSTANTS.ERROR_MESSAGE);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
            setIsVerifying(false);
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