import type { UsuarioResponse } from './UsuarioInterfaces.tsx';

// Interface para contexto de autenticação
export interface AuthResponse {
    user: UsuarioResponse | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

// Interface para estado de autenticação
export interface AuthState {
    user: UsuarioResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;
}

// Interface para ações de autenticação
export interface AuthActions {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (userData: RegisterUserData) => Promise<boolean>;
    refreshToken: () => Promise<boolean>;
    updateProfile: (profileData: Partial<UsuarioResponse>) => Promise<boolean>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
    resetPassword: (email: string) => Promise<boolean>;
    verifyEmail: (token: string) => Promise<boolean>;
    checkAuthStatus: () => Promise<boolean>;
}

// Interface para dados de registro
export interface RegisterUserData {
    name: string;
    email: string;
    telefone: string;
    password: string;
    role: string;
    confirmPassword?: string;
}

// Interface para token de autenticação
export interface AuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

// Interface para resposta de autenticação
export interface AuthenticationResponse {
    success: boolean;
    message?: string;
    user?: UsuarioResponse;
    token?: AuthToken;
    errors?: Record<string, string[]>;
}

// Interface para configuração de autenticação
export interface AuthConfig {
    baseUrl: string;
    endpoints: {
        login: string;
        register: string;
        logout: string;
        refresh: string;
        profile: string;
        changePassword: string;
        resetPassword: string;
        verifyEmail: string;
    };
    tokenKey: string;
    refreshTokenKey: string;
    autoRefresh: boolean;
    refreshThreshold: number; // em minutos
}

// Interface para contexto do provedor de autenticação
export interface AuthContextType extends AuthState, AuthActions {
    config: AuthConfig;
}

// Interface para hooks de autenticação
export interface UseAuthReturn extends AuthState, AuthActions {}

// Interface para validação de senha
export interface PasswordValidation {
    isValid: boolean;
    errors: {
        minLength?: string;
        hasUppercase?: string;
        hasLowercase?: string;
        hasNumbers?: string;
        hasSpecialChars?: string;
    };
    strength: 'weak' | 'medium' | 'strong';
}

// Interface para recuperação de senha
export interface PasswordResetData {
    email: string;
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
}

// Interface para alteração de senha
export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Interface para verificação de email
export interface EmailVerificationData {
    email: string;
    token: string;
    isVerified: boolean;
}

// Tipos para diferentes tipos de autenticação
export type AuthProvider = 'local' | 'google' | 'facebook' | 'github';

// Interface para autenticação via provedor externo
export interface ExternalAuthData {
    provider: AuthProvider;
    providerToken: string;
    providerUserId: string;
    email?: string;
    name?: string;
    avatar?: string;
}

// Interface para permissões de acesso
export interface AccessPermissions {
    roles: string[];
    permissions: string[];
    canAccess: (resource: string, action: string) => boolean;
}

// Interface para sessão de usuário
export interface UserSession {
    sessionId: string;
    userId: number;
    createdAt: string;
    expiresAt: string;
    lastActivity: string;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
}

// Tipos para eventos de autenticação
export type AuthEventType = 
    | 'login'
    | 'logout'
    | 'register'
    | 'password_change'
    | 'password_reset'
    | 'email_verification'
    | 'token_refresh'
    | 'profile_update';

// Interface para eventos de autenticação
export interface AuthEvent {
    type: AuthEventType;
    timestamp: string;
    userId?: number;
    details?: Record<string, any>;
    success: boolean;
    error?: string;
}