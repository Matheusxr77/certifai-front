// Interface para dados do perfil
export interface ProfileData {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Interface para requisição de nova senha
export interface NovaSenhaRequest {
    senhaAntiga: string;
    novaSenha: string;
    confirmarNovaSenha: string;
}

// Interface para o controller
export interface ProfileControllerHook {
    profileData: ProfileData | null;
    selectedRole: string;
    setSelectedRole: (role: string) => void;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    success: string | null;
    handleUpdateProfile: (event: React.FormEvent) => Promise<void>;
    handleRoleChange: (role: string) => void;
    clearMessages: () => void;
    refreshProfile: () => Promise<void>;
    currentPassword: string;
    setCurrentPassword: (password: string) => void;
    newPassword: string;
    setNewPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    isChangingPassword: boolean;
    handlePasswordChange: (event: React.FormEvent) => Promise<void>;
    showPasswordForm: boolean;
    setShowPasswordForm: (show: boolean) => void;
    isDeactivating: boolean;
    handleDeactivateUser: () => Promise<void>;
    showDeactivateForm: boolean;
    setShowDeactivateForm: (show: boolean) => void;
    showProfileForm: boolean;
    setShowProfileForm: (show: boolean) => void;
    isDeleting: boolean;
    handleDeleteAccount: () => Promise<void>;
    showDeleteForm: boolean;
    setShowDeleteForm: (show: boolean) => void;
    getRoleDescription: (role: string) => string;
    getRoleLabel: (role: string) => string;
}

// Tipo para opções de papel/perfil
export interface RoleOption {
    value: string;
    label: string;
    description: string;
}

// Opções de papel/perfil
export const ROLE_OPTIONS: RoleOption[] = [
    {
        value: 'ESTUDANTE',
        label: 'Como Estudante',
        description: 'Acesso a questões, simulados e relatórios de desempenho'
    },
    {
        value: 'PROFESSOR',
        label: 'Como Professor',
        description: 'Acesso completo para criar e gerenciar conteúdo educacional'
    }
];

// Constantes da página
export const PROFILE_CONSTANTS = {
    PAGE_TITLE: 'Dados da Conta',
    FORM_TITLE: 'Informações do Perfil',
    UPDATE_BUTTON_TEXT: 'ATUALIZAR PERFIL',
    UPDATING_BUTTON_TEXT: 'ATUALIZANDO...',
    LOADING_MESSAGE: 'Carregando perfil...',
    SUCCESS_MESSAGE: 'Perfil atualizado com sucesso!',
    ERROR_MESSAGE: 'Erro ao atualizar perfil. Tente novamente.',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    VALIDATION_ERROR: 'Selecione um tipo de perfil válido.',
    REFRESH_DELAY: 2000,
    SHOW_PROFILE_FORM_TEXT: 'Atualizar Perfil',
    HIDE_PROFILE_FORM_TEXT: 'Cancelar',
    PASSWORD_FORM_TITLE: 'Alterar Senha',
    CHANGE_PASSWORD_BUTTON_TEXT: 'ALTERAR SENHA',
    CHANGING_PASSWORD_BUTTON_TEXT: 'ALTERANDO...',
    SHOW_PASSWORD_FORM_TEXT: 'Alterar Senha',
    HIDE_PASSWORD_FORM_TEXT: 'Cancelar',
    PASSWORD_SUCCESS_MESSAGE: 'Senha alterada com sucesso!',
    CURRENT_PASSWORD_LABEL: 'Senha Atual',
    NEW_PASSWORD_LABEL: 'Nova Senha',
    CONFIRM_PASSWORD_LABEL: 'Confirmar Nova Senha',
    CURRENT_PASSWORD_PLACEHOLDER: 'Digite sua senha atual',
    NEW_PASSWORD_PLACEHOLDER: 'Digite sua nova senha',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Confirme sua nova senha',
    PASSWORD_REQUIREMENTS: 'A senha deve ter pelo menos 8 caracteres',
    DEACTIVATE_USER_TITLE: 'Desativar Conta',
    DEACTIVATE_BUTTON_TEXT: 'DESATIVAR CONTA',
    DEACTIVATING_BUTTON_TEXT: 'DESATIVANDO...',
    DEACTIVATE_SUCCESS_MESSAGE: 'Conta desativada com sucesso!',
    SHOW_DEACTIVATE_FORM_TEXT: 'Desativar Conta',
    HIDE_DEACTIVATE_FORM_TEXT: 'Cancelar',
    DEACTIVATE_DESCRIPTION: 'Ao desativar sua conta, seu registro ficará inativo e não receberá notificações, mas será possível recuperar seus dados logando novamente.',
    DEACTIVATE_WARNING: 'Atenção: Esta ação desativará sua conta permanentemente. Você será desconectado imediatamente.',
    DELETE_SUCCESS_MESSAGE: 'Conta excluída com sucesso. Redirecionando para login...',
    DELETE_BUTTON_TEXT: 'Excluir Conta Permanentemente'
};

// Mensagens de erro específicas
export const PROFILE_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    VALIDATION_ERROR: 'Dados inválidos fornecidos.',
    UNAUTHORIZED: 'Você não tem permissão para esta ação.',
    NOT_FOUND: 'Perfil não encontrado.',
    SERVER_ERROR: 'Erro interno do servidor.',
    UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
    PASSWORD_REQUIRED: 'Senha é obrigatória',
    CURRENT_PASSWORD_REQUIRED: 'Senha atual é obrigatória',
    NEW_PASSWORD_REQUIRED: 'Nova senha é obrigatória',
    CONFIRM_PASSWORD_REQUIRED: 'Confirmação de senha é obrigatória',
    PASSWORD_WEAK: 'A senha deve ter pelo menos 6 caracteres',
    PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
    CURRENT_PASSWORD_WRONG: 'Senha atual incorreta',
    PASSWORD_SAME_AS_CURRENT: 'A nova senha deve ser diferente da atual',
    DEACTIVATE_ERROR: 'Erro ao desativar conta. Tente novamente.',
    DEACTIVATE_UNAUTHORIZED: 'Você não tem permissão para desativar esta conta.',
    DELETE_ERROR: 'Erro ao excluir conta. Tente novamente.',
    DELETE_UNAUTHORIZED: 'Você não tem permissão para excluir esta conta.'
};

// Tipo para erros
export type ProfileErrorType = 
    | 'NETWORK_ERROR'
    | 'VALIDATION_ERROR'
    | 'UNAUTHORIZED'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR';