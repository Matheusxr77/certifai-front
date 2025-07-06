import type { RegisterControllerReturn } from '../../interfaces/LoginInterfaces.tsx';

// Interface para dados de registro
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: string;
}

// Interface para dados de registro do Google
export interface GoogleRegisterData {
    googleToken: string;
    email: string;
    name: string;
    role: string;
}

// Interface para opções de role
export interface RoleOption {
    value: string;
    label: string;
}

// Constantes do Google Register
export const GOOGLE_REGISTER_CONSTANTS = {
    BUTTON_TEXT: 'Registrar com Google',
    SUCCESS_MESSAGE: 'Registro com Google realizado com sucesso!',
    ERROR_MESSAGE: 'Erro ao registrar com Google. Tente novamente.'
};

// Exportar o tipo do hook para compatibilidade
export type RegisterControllerHook = RegisterControllerReturn;