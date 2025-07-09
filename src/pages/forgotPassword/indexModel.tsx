// Interface para resposta do backend
export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    data?: {
        email: string;
        resetTokenSent: boolean;
    };
}

// Interface para o controller
export interface ForgotPasswordControllerHook {
    email: string;
    setEmail: (email: string) => void;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    handleSubmit: (event: React.FormEvent) => Promise<void>;
    handleBackToLogin: () => void;
    validateForm: () => boolean;
    clearMessages: () => void;
}

// Constantes da página
export const FORGOT_PASSWORD_CONSTANTS = {
    PAGE_TITLE: 'Esqueci minha senha',
    SUBTITLE: 'Digite seu email para receber as instruções de recuperação',
    SUBMIT_BUTTON_TEXT: 'ENVIAR INSTRUÇÕES',
    SUBMITTING_BUTTON_TEXT: 'ENVIANDO...',
    BACK_TO_LOGIN_TEXT: 'Voltar para o login',
    SUCCESS_MESSAGE: 'Instruções de recuperação enviadas para seu email!',
    EMAIL_PLACEHOLDER: 'Digite seu email',
    EMAIL_LABEL: 'Email',
    EMAIL_NOT_FOUND_MESSAGE: 'Email não encontrado em nosso sistema.',
    VERIFICATION_MESSAGE: 'Verifique sua caixa de entrada e spam para as instruções de recuperação.'
};

// Mensagens de erro específicas
export const FORGOT_PASSWORD_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    VALIDATION_ERROR: 'Email é obrigatório e deve ser válido.',
    NOT_FOUND: 'Email não encontrado em nosso sistema.',
    SERVER_ERROR: 'Erro interno do servidor.',
    UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
    RATE_LIMIT: 'Muitas tentativas. Tente novamente em alguns minutos.',
    EMAIL_REQUIRED: 'Email é obrigatório',
    EMAIL_INVALID: 'Digite um email válido'
};

// Tipo para erros
export type ForgotPasswordErrorType = 
    | 'NETWORK_ERROR'
    | 'VALIDATION_ERROR'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR'
    | 'RATE_LIMIT';