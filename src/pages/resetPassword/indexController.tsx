import { 
    useState, 
    useEffect 
} from 'react';
import { 
    useNavigate, 
    useSearchParams 
} from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';
import {
    RESET_PASSWORD_CONSTANTS,
    RESET_PASSWORD_ERROR_MESSAGES
} from './indexModel';

import type {
    ResetPasswordControllerHook,
    ResetPasswordData,
    ResetPasswordErrorType,
    ResetPasswordResponse
} from './indexModel';
import type { AbstractResponse } from '../../interfaces/AbstractInterfaces';

export const useResetPasswordController = (): ResetPasswordControllerHook => {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isTokenValid, setIsTokenValid] = useState(false);

    const navigate = useNavigate();

    // Extrair token da URL quando componente monta
    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
            validateToken(urlToken);
        } else {
            setError(RESET_PASSWORD_CONSTANTS.TOKEN_INVALID_MESSAGE);
        }
    }, [searchParams]);

    // Validação de senha
    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    // Validação de confirmação de senha
    const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    };

    const validateToken = async (tokenToValidate?: string) => {
        const tokenValue = tokenToValidate || token;
        if (!tokenValue) return;

        try {
            setIsLoading(true);
            setError(null);

            // Verificar se o token é válido - usar POST em vez de GET
            const response = await api.post<AbstractResponse<any>>(`/auth/validate-reset-token/${tokenValue}`);
            
            if (response.data.success) {
                setIsTokenValid(true);
            } else {
                setIsTokenValid(false);
                setError(RESET_PASSWORD_CONSTANTS.TOKEN_INVALID_MESSAGE);
            }
        } catch (error: any) {
            setIsTokenValid(false);
            
            if (error?.response?.status === 404 || error?.response?.status === 400 || error?.response?.status === 401) {
                setError(RESET_PASSWORD_CONSTANTS.TOKEN_INVALID_MESSAGE);
            } else {
                setError(RESET_PASSWORD_ERROR_MESSAGES.NETWORK_ERROR);
            }
        } finally {
            setIsLoading(false);
        }
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

            const resetData: ResetPasswordData = {
                token: token,
                novaSenha: newPassword.trim(),
                confirmarNovaSenha: confirmPassword.trim()
            };

            // Fazer requisição para redefinir senha
            const response = await api.post<AbstractResponse<ResetPasswordResponse>>(`/auth/reset-password`, resetData);
            
            if (response.data.success) {
                setSuccess(RESET_PASSWORD_CONSTANTS.SUCCESS_MESSAGE);
                toast.success(RESET_PASSWORD_CONSTANTS.SUCCESS_MESSAGE);
                
                // Limpar o formulário
                setNewPassword('');
                setConfirmPassword('');
                
                // Redirecionar para login após alguns segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                handleApiError(response.data.message || 'UNKNOWN_ERROR');
            }

        } catch (error: any) {
            console.error('Erro na redefinição de senha:', error);
            handleRequestError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApiError = (message: string) => {
        if (message.includes('token') && (message.includes('inválido') || message.includes('expirado'))) {
            setError(RESET_PASSWORD_CONSTANTS.TOKEN_EXPIRED_MESSAGE);
            toast.error(RESET_PASSWORD_CONSTANTS.TOKEN_EXPIRED_MESSAGE);
            setIsTokenValid(false);
        } else if (message.includes('não encontrado') || message.includes('not found')) {
            setError(RESET_PASSWORD_ERROR_MESSAGES.USER_NOT_FOUND);
            toast.error(RESET_PASSWORD_ERROR_MESSAGES.USER_NOT_FOUND);
        } else {
            setError(message);
            toast.error(message);
        }
    };

    const handleRequestError = (error: any) => {
        if (error?.response?.status === 400 || error?.response?.status === 401) {
            setError(RESET_PASSWORD_CONSTANTS.TOKEN_EXPIRED_MESSAGE);
            toast.error(RESET_PASSWORD_CONSTANTS.TOKEN_EXPIRED_MESSAGE);
            setIsTokenValid(false);
        } else if (error?.response?.status === 404) {
            setError(RESET_PASSWORD_ERROR_MESSAGES.USER_NOT_FOUND);
            toast.error(RESET_PASSWORD_ERROR_MESSAGES.USER_NOT_FOUND);
        } else {
            const errorType = getErrorType(error);
            const errorMessage = getErrorMessage(errorType);
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const validateForm = (): boolean => {
        if (!newPassword.trim()) {
            setError(RESET_PASSWORD_ERROR_MESSAGES.PASSWORD_REQUIRED);
            toast.error(RESET_PASSWORD_ERROR_MESSAGES.PASSWORD_REQUIRED);
            return false;
        }

        if (!validatePassword(newPassword.trim())) {
            setError(RESET_PASSWORD_ERROR_MESSAGES.PASSWORD_WEAK);
            toast.error(RESET_PASSWORD_ERROR_MESSAGES.PASSWORD_WEAK);
            return false;
        }

        if (!confirmPassword.trim()) {
            setError(RESET_PASSWORD_ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED);
            toast.error(RESET_PASSWORD_ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED);
            return false;
        }

        if (!validatePasswordMatch(newPassword.trim(), confirmPassword.trim())) {
            setError(RESET_PASSWORD_ERROR_MESSAGES.PASSWORDS_DONT_MATCH);
            toast.error(RESET_PASSWORD_ERROR_MESSAGES.PASSWORDS_DONT_MATCH);
            return false;
        }

        return true;
    };

    const getErrorType = (error: any): ResetPasswordErrorType => {
        if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
            return 'NETWORK_ERROR';
        } else if (error?.response?.status === 400 || error?.response?.status === 401) {
            return 'TOKEN_INVALID';
        } else if (error?.response?.status === 404) {
            return 'USER_NOT_FOUND';
        } else if (error?.response?.status >= 500) {
            return 'SERVER_ERROR';
        } else {
            return 'UNKNOWN_ERROR';
        }
    };

    const getErrorMessage = (errorType: ResetPasswordErrorType): string => {
        return RESET_PASSWORD_ERROR_MESSAGES[errorType] || RESET_PASSWORD_ERROR_MESSAGES.UNKNOWN_ERROR;
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        token,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        isLoading,
        error,
        success,
        isTokenValid,
        handleSubmit,
        handleBackToLogin,
        validateForm,
        clearMessages,
        validateToken
    };
};