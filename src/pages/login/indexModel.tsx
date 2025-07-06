import type { LoginControllerReturn } from '../../interfaces/LoginInterfaces.tsx';

// Interface para dados de login
export interface LoginData {
    email: string;
    password: string;
}

// Interface para dados de login do Google
export interface GoogleLoginData {
    googleToken: string;
    email: string;
    name: string;
}

// Interface para validação do login
export interface LoginValidation {
    isValid: boolean;
    errors: {
        email?: string;
        password?: string;
    };
}

// Tipos para validação
export type LoginErrorType = 'NETWORK' | 'VALIDATION' | 'UNAUTHORIZED' | 'UNKNOWN';

export interface LoginError {
    type: LoginErrorType;
    message: string;
    details?: string;
}

// Constantes do Google Login
export const GOOGLE_LOGIN_CONSTANTS = {
    BUTTON_TEXT: 'Login com Google',
    SUCCESS_MESSAGE: 'Login com Google realizado com sucesso!',
    ERROR_MESSAGE: 'Erro ao fazer login com Google. Tente novamente.'
};

// Exportar o tipo do hook para compatibilidade
export type LoginControllerHook = LoginControllerReturn;