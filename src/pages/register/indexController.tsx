import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GOOGLE_REGISTER_CONSTANTS } from './indexModel.tsx';
import api from '../../api.tsx';

import type { RegisterResponse } from '../../interfaces/LoginInterfaces.tsx';
import type { 
    RegisterData, 
    RoleOption 
} from './indexModel.tsx';
import type { RegisterControllerHook } from './indexModel.tsx';
import type { AbstractResponse } from '../../interfaces/AbstractInterfaces.tsx';

export const useRegisterController = (): RegisterControllerHook & {
    ROLE_OPTIONS: RoleOption[];
    handleGoogleRegister: () => void;
} => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Constantes locais dentro do hook
    const ROLE_OPTIONS: RoleOption[] = [
        { value: 'ESTUDANTE', label: 'Como Estudante' },
        { value: 'PROFESSOR', label: 'Como Professor' }
    ];

    const RegisterValidation = {
        validateEmail: (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        validatePassword: (password: string): boolean => {
            return password.length >= 6;
        },

        validatePasswordMatch: (password: string, confirmPassword: string): boolean => {
            return password === confirmPassword;
        },

        validateName: (name: string): boolean => {
            return name.trim().length >= 2;
        },

        validateRole: (role: string): boolean => {
            return ROLE_OPTIONS.some(option => option.value === role);
        }
    };

    const registerService = async (userData: RegisterData) => {
        const response = await api.post<AbstractResponse<RegisterResponse>>(
            '/auth/register',
            userData
        );
        
        return response.data;
    };

    const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
        try {
            const data = await registerService(userData);
            
            return {
                success: true,
                data: data.data.data
            };
        } catch (error) {            
            return {
                success: false,
                message: 'Erro ao registrar usuário'
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoading) return;

        // Validação dos campos
        const newErrors: {[key: string]: string} = {};

        // Validação do nome
        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (!RegisterValidation.validateName(name)) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }

        // Validação do email
        if (!email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!RegisterValidation.validateEmail(email)) {
            newErrors.email = 'Email deve ter um formato válido';
        }

        // Validação da senha
        if (!password.trim()) {
            newErrors.password = 'Senha é obrigatória';
        } else if (!RegisterValidation.validatePassword(password)) {
            newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
        }

        // Validação da confirmação de senha
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (!RegisterValidation.validatePasswordMatch(password, confirmPassword)) {
            newErrors.confirmPassword = 'Senhas não coincidem';
        }

        // Validação do role
        if (!role.trim()) {
            newErrors.role = 'Perfil é obrigatório';
        } else if (!RegisterValidation.validateRole(role)) {
            newErrors.role = 'Selecione um perfil válido';
        }

        // Se houver erros, não submeter
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Limpar erros
        setErrors({});
        setIsLoading(true);

        try {
            const registerData: RegisterData = {
                name: name.trim(),
                email: email.trim(),
                password: password,
                role: role
            };

            const result = await registerUser(registerData);
            
            if (result.success) {
                navigate('/login');
                toast.success('Usuário registrado com sucesso, confirme seu email.');
                
            } else {
                setErrors({ general: result.message || 'Erro ao registrar usuário' });
                toast.error(result.message || 'Erro ao registrar usuário');
            }
        } catch (error) {
            setErrors({ general: 'Erro interno do servidor' });
            toast.error('Erro interno do servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleGoogleRegister = async () => {
        try {
            setIsLoading(true);
            
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`
            
            navigate('/dashboard');
            toast.success('Usuário registrado e logado com sucesso!');
        } catch (error) {
            setErrors({ general: GOOGLE_REGISTER_CONSTANTS.ERROR_MESSAGE });
            toast.error(GOOGLE_REGISTER_CONSTANTS.ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para validar o formulário (pode ser customizada conforme o contrato)
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (!RegisterValidation.validateName(name)) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (!email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!RegisterValidation.validateEmail(email)) {
            newErrors.email = 'Email deve ter um formato válido';
        }

        if (!password.trim()) {
            newErrors.password = 'Senha é obrigatória';
        } else if (!RegisterValidation.validatePassword(password)) {
            newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (!RegisterValidation.validatePasswordMatch(password, confirmPassword)) {
            newErrors.confirmPassword = 'Senhas não coincidem';
        }

        if (!role.trim()) {
            newErrors.role = 'Perfil é obrigatório';
        } else if (!RegisterValidation.validateRole(role)) {
            newErrors.role = 'Selecione um perfil válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Função para limpar erros
    const clearErrors = () => setErrors({});

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        role,
        setRole,
        errors,
        isLoading,
        handleSubmit,
        handleLoginClick,
        ROLE_OPTIONS,
        handleGoogleRegister,
        validateForm,
        clearErrors
    };
};