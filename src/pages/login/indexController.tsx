import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext.tsx';
import { GOOGLE_LOGIN_CONSTANTS } from './indexModel.tsx';

import type { LoginControllerHook } from './indexModel.tsx';

export const useLoginController = (): LoginControllerHook & {
    handleGoogleLogin: () => Promise<void>;
    handleForgotPasswordClick: (e: React.MouseEvent) => void;
} => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const success = await login(email, password);
            
            if (success) {
                navigate('/dashboard');
                toast.success('Login realizado com sucesso!');
            } else {
                setError('Email ou senha inválidos.');
                toast.error('Email ou senha inválidos.');
            }
        } catch (error) {
            const errorMessage = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleForgotPasswordClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/forgot-password');
    };

    const validateForm = (): boolean => {
        if (!email || !password) {
            setError('Email e senha são obrigatórios');
            return false;
        }
        setError(null);
        return true;
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`

            setTimeout(() => {
                navigate('/dashboard');
                toast.success(GOOGLE_LOGIN_CONSTANTS.SUCCESS_MESSAGE);
            }, 3000);
        } catch (error) {
            setError(GOOGLE_LOGIN_CONSTANTS.ERROR_MESSAGE);
            toast.error(GOOGLE_LOGIN_CONSTANTS.ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    const clearErrors = () => {
        setError(null);
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleSubmit,
        handleRegisterClick,
        handleGoogleLogin,
        handleForgotPasswordClick,
        validateForm,
        clearErrors
    };
};