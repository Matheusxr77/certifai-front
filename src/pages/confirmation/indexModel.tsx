// Interface para dados da confirmação
export interface ConfirmationData {
    token?: string;
    email?: string;
    isVerified: boolean;
}

// Interface para estado da confirmação
export interface ConfirmationState {
    isLoading: boolean;
    isVerified: boolean;
    error: string | null;
    message: string;
}

// Interface para ações da confirmação
export interface ConfirmationActions {
    handleLoginClick: () => void;
    verifyEmail: (token?: string) => void;
    clearError: () => void;
}

// Interface para controlador da confirmação
export interface ConfirmationControllerReturn extends ConfirmationState, ConfirmationActions {}

// Constantes da confirmação
export const CONFIRMATION_CONSTANTS = {
    SUCCESS_MESSAGE: 'Seu e-mail foi verificado com sucesso!\nVocê já pode fazer login.',
    ERROR_MESSAGE: 'Erro ao verificar seu e-mail. Tente novamente.',
    LOADING_MESSAGE: 'Verificando seu e-mail...',
    REDIRECT_DELAY: 3000
};

// Mensagens de erro específicas
export const CONFIRMATION_ERROR_MESSAGES = {
    INVALID_TOKEN: 'Token de verificação inválido.',
    EXPIRED_TOKEN: 'Token de verificação expirado.',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    ALREADY_VERIFIED: 'Este e-mail já foi verificado anteriormente.',
    UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.'
};

// Tipos para validação
export type ConfirmationErrorType = 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'NETWORK' | 'ALREADY_VERIFIED' | 'UNKNOWN';

export interface ConfirmationError {
    type: ConfirmationErrorType;
    message: string;
    details?: string;
}