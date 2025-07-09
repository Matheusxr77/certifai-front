import type { UsuarioResponse } from './UsuarioInterfaces.tsx';
import type { RoleOption } from '../pages/register/indexModel.tsx';

// Interface para resposta de login
export interface LoginResponse {
    token: string;
    usuario: UsuarioResponse;
}

// Interface para estado do login
export interface LoginState {
    email: string;
    password: string;
    isLoading: boolean;
    error: string | null;
}

// Interface para ações do login
export interface LoginActions {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleRegisterClick: () => void;
    handleForgotPasswordClick: (e: React.MouseEvent) => void;
    validateForm: () => boolean;
    clearErrors: () => void;
}

// Interface para controlador do login
export interface LoginControllerReturn extends LoginState, LoginActions {}

// Interface para resposta de registro
export interface RegisterResponse {
    success: boolean;
    message?: string;
    data?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

// Interface para estado do registro
export interface RegisterState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    isLoading: boolean;
    errors: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        role?: string;
    };
}

// Interface para ações do registro
export interface RegisterActions {
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
    setRole: (role: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleLoginClick: () => void;
    validateForm: () => boolean;
    clearErrors: () => void;
    ROLE_OPTIONS: RoleOption[];
}

// Interface para controlador do registro
export interface RegisterControllerReturn extends RegisterState, RegisterActions {}