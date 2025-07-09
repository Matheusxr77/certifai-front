import type { UsuarioResponse } from './UsuarioInterfaces.tsx';

// Interface para contexto de autenticação
export interface AuthResponse {
    user: UsuarioResponse | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}