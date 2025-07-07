import React, { 
    createContext, 
    useState, 
    useContext 
} from 'react';
import type { UsuarioResponse } from '../interfaces/UsuarioInterfaces.tsx';
import type { AuthResponse } from '../interfaces/AuthInterfaces.tsx';
import type { LoginResponse } from '../interfaces/LoginInterfaces.tsx';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces.tsx';
import api from '../api.tsx';

const AuthContext = createContext<AuthResponse | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UsuarioResponse | null>(null);

    const loginService = async function(email: string, password: string) {
        const response = await api.post<AbstractResponse<LoginResponse>>(
            '/auth/login',
            { email, password }
        );
        
        return response.data;
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const data = await loginService(email, password);
            const token = data.data.token;
            const usuario = data.data.usuario;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(usuario));

            setUser(usuario);
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};