export interface GoogleLoginButtonProps {
    onSuccess: (googleToken: string, email: string, name: string) => void;
    onError: (error: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
    buttonText?: string;
}

export interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
    client_id?: string;
}

export interface GoogleJWTPayload {
    email: string;
    name: string;
    sub: string;
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
    locale?: string;
}

export interface GoogleConfig {
    clientId: string;
    autoSelect: boolean;
    cancelOnTapOutside: boolean;
    scriptUrl: string;
}

export const DEFAULT_GOOGLE_CONFIG: GoogleConfig = {
    clientId: 'seu-google-client-id-aqui',
    autoSelect: false,
    cancelOnTapOutside: true,
    scriptUrl: 'https://accounts.google.com/gsi/client'
};

export const DEFAULT_BUTTON_TEXT = 'Google';

export const ERROR_MESSAGES = {
    PROCESSING_ERROR: 'Erro ao processar resposta do Google',
    UNAVAILABLE_ERROR: 'Google Sign-In não está disponível',
    SCRIPT_LOAD_ERROR: 'Erro ao carregar script do Google'
} as const;

// Declaração global para o objeto window.google
declare global {
    interface Window {
        google: any;
    }
}