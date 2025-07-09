import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';
import {
    FORGOT_PASSWORD_CONSTANTS,
    FORGOT_PASSWORD_ERROR_MESSAGES
} from './indexModel';

import type {
    ForgotPasswordControllerHook,
    ForgotPasswordErrorType,
    ForgotPasswordResponse
} from './indexModel';
import type { AbstractResponse } from '../../interfaces/AbstractInterfaces';

export const useForgotPasswordController = (): ForgotPasswordControllerHook => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigate = useNavigate();

    // Validação de email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            const emailParam = email.trim().toLowerCase();
            
            // Fazer requisição com email como query parameter
            const response = await api.post<AbstractResponse<ForgotPasswordResponse>>(`/auth/esqueci-senha?email=${emailParam}`);
            
            if (response.data.success) {
                setSuccess(`${FORGOT_PASSWORD_CONSTANTS.SUCCESS_MESSAGE} ${FORGOT_PASSWORD_CONSTANTS.VERIFICATION_MESSAGE}`);
                toast.success(FORGOT_PASSWORD_CONSTANTS.SUCCESS_MESSAGE);
                
                // Limpar o formulário após sucesso
                setEmail('');
                
                // Opcionalmente redirecionar para login após alguns segundos
                setTimeout(() => {
                    setSuccess(null);
                }, 5000);
            } else {
                // Tratar caso específico de email não encontrado
                if (response.data.message?.includes('não encontrado') || response.data.message?.includes('not found')) {
                    setError(FORGOT_PASSWORD_CONSTANTS.EMAIL_NOT_FOUND_MESSAGE);
                    toast.error(FORGOT_PASSWORD_CONSTANTS.EMAIL_NOT_FOUND_MESSAGE);
                } else {
                    throw new Error(response.data.message || 'UNKNOWN_ERROR');
                }
            }

        } catch (error: any) {
            console.error('Erro na recuperação de senha:', error);
            
            // Tratamento específico para diferentes tipos de erro
            if (error?.response?.status === 404) {
                setError(FORGOT_PASSWORD_CONSTANTS.EMAIL_NOT_FOUND_MESSAGE);
                toast.error(FORGOT_PASSWORD_CONSTANTS.EMAIL_NOT_FOUND_MESSAGE);
            } else {
                const errorType = getErrorType(error);
                const errorMessage = getErrorMessage(errorType);
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setError(FORGOT_PASSWORD_ERROR_MESSAGES.EMAIL_REQUIRED);
            toast.error(FORGOT_PASSWORD_ERROR_MESSAGES.EMAIL_REQUIRED);
            return false;
        }

        if (!validateEmail(email.trim())) {
            setError(FORGOT_PASSWORD_ERROR_MESSAGES.EMAIL_INVALID);
            toast.error(FORGOT_PASSWORD_ERROR_MESSAGES.EMAIL_INVALID);
            return false;
        }

        return true;
    };

    const getErrorType = (error: any): ForgotPasswordErrorType => {
        if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
            return 'NETWORK_ERROR';
        } else if (error?.response?.status === 404) {
            return 'NOT_FOUND';
        } else if (error?.response?.status === 429) {
            return 'RATE_LIMIT';
        } else if (error?.response?.status >= 500) {
            return 'SERVER_ERROR';
        } else {
            return 'UNKNOWN_ERROR';
        }
    };

    const getErrorMessage = (errorType: ForgotPasswordErrorType): string => {
        return FORGOT_PASSWORD_ERROR_MESSAGES[errorType] || FORGOT_PASSWORD_ERROR_MESSAGES.UNKNOWN_ERROR;
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        email,
        setEmail,
        isLoading,
        error,
        success,
        handleSubmit,
        handleBackToLogin,
        validateForm,
        clearMessages
    };
};