// Interface para dados de reset de senha
export interface ResetPasswordData {
    token: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}

// Interface para resposta do backend
export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    data?: {
        email: string;
        passwordReset: boolean;
    };
}

// Interface para o controller
export interface ResetPasswordControllerHook {
    token: string;
    newPassword: string;
    setNewPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    isTokenValid: boolean;
    handleSubmit: (event: React.FormEvent) => Promise<void>;
    handleBackToLogin: () => void;
    validateForm: () => boolean;
    clearMessages: () => void;
    validateToken: () => Promise<void>;
}

// Constantes da página
export const RESET_PASSWORD_CONSTANTS = {
    PAGE_TITLE: 'Definir Nova Senha',
    SUBTITLE: 'Digite sua nova senha para concluir a recuperação',
    SUBMIT_BUTTON_TEXT: 'REDEFINIR SENHA',
    SUBMITTING_BUTTON_TEXT: 'REDEFININDO...',
    BACK_TO_LOGIN_TEXT: 'Voltar para o login',
    SUCCESS_MESSAGE: 'Senha redefinida com sucesso!',
    PASSWORD_PLACEHOLDER: 'Digite sua nova senha',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Confirme sua nova senha',
    PASSWORD_LABEL: 'Nova Senha',
    CONFIRM_PASSWORD_LABEL: 'Confirmar Nova Senha',
    TOKEN_INVALID_MESSAGE: 'Link de recuperação inválido ou expirado.',
    TOKEN_EXPIRED_MESSAGE: 'Link de recuperação expirado. Solicite um novo.',
    REDIRECT_MESSAGE: 'Redirecionando para o login...',
    PASSWORD_REQUIREMENTS: 'A senha deve ter pelo menos 8 caracteres.'
};

// Mensagens de erro específicas
export const RESET_PASSWORD_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    VALIDATION_ERROR: 'Dados inválidos fornecidos.',
    TOKEN_INVALID: 'Link de recuperação inválido ou expirado.',
    TOKEN_EXPIRED: 'Link de recuperação expirado. Solicite um novo.',
    PASSWORD_REQUIRED: 'Nova senha é obrigatória',
    PASSWORD_WEAK: 'A senha deve ter pelo menos 8 caracteres',
    PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
    CONFIRM_PASSWORD_REQUIRED: 'Confirmação de senha é obrigatória',
    SERVER_ERROR: 'Erro interno do servidor.',
    UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
    USER_NOT_FOUND: 'Usuário não encontrado.'
};

// Tipo para erros
export type ResetPasswordErrorType = 
    | 'NETWORK_ERROR'
    | 'VALIDATION_ERROR'
    | 'TOKEN_INVALID'
    | 'TOKEN_EXPIRED'
    | 'USER_NOT_FOUND'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR';