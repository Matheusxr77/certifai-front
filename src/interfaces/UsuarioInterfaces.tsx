// Interface para dados do usuário
export interface UsuarioResponse {
    id: number;
    name: string;
    email: string;
    telefone?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Interface para dados de perfil do usuário
export interface UsuarioProfile {
    id: number;
    name: string;
    email: string;
    telefone?: string;
    role?: string;
    avatar?: string;
    biografia?: string;
    preferences?: UsuarioPreferences;
}

// Interface para preferências do usuário
export interface UsuarioPreferences {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    notifications?: boolean;
    emailNotifications?: boolean;
    autoSave?: boolean;
}

// Interface para atualização de dados do usuário
export interface UsuarioUpdateData {
    name?: string;
    email?: string;
    telefone?: string;
    role?: string;
    avatar?: string;
    biografia?: string;
    preferences?: Partial<UsuarioPreferences>;
}

// Interface para filtros de usuário
export interface UsuarioFilters {
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    createdAfter?: string;
    createdBefore?: string;
}

// Interface para listagem de usuários
export interface UsuarioListResponse {
    users: UsuarioResponse[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Interface para validação de usuário
export interface UsuarioValidation {
    isValid: boolean;
    errors: {
        name?: string;
        email?: string;
        telefone?: string;
        role?: string;
    };
}

// Tipos para diferentes papéis de usuário
export type UsuarioRole = 'admin' | 'professor' | 'estudante' | 'guest';

// Interface para permissões do usuário
export interface UsuarioPermissions {
    canRead: boolean;
    canWrite: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canManageUsers?: boolean;
    canViewReports?: boolean;
    canExportData?: boolean;
}

// Interface para sessão do usuário
export interface UsuarioSession {
    user: UsuarioResponse;
    token: string;
    expiresAt: string;
    permissions: UsuarioPermissions;
    lastActivity: string;
}

// Tipos para status do usuário
export type UsuarioStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// Interface para dados completos do usuário
export interface UsuarioCompleto extends UsuarioResponse {
    status: UsuarioStatus;
    permissions: UsuarioPermissions;
    lastLogin?: string;
    loginCount?: number;
    isEmailVerified?: boolean;
    isTelefoneVerified?: boolean;
}