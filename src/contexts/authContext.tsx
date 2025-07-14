import React, {
    createContext,
    useState,
    useContext,
    useEffect,
} from 'react';
import api from '../api.tsx';
import apiWithoutAuthHeader from '../apiSemHeader.tsx';

import type { UsuarioResponse } from '../interfaces/UsuarioInterfaces.tsx';
import type { AuthResponse } from '../interfaces/AuthInterfaces.tsx';
import type { LoginResponse } from '../interfaces/LoginInterfaces.tsx';
import type { AbstractResponse } from '../interfaces/AbstractInterfaces.tsx';

const AuthContext = createContext<AuthResponse | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UsuarioResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post<AbstractResponse<LoginResponse>>(
                '/auth/login',
                { email, password }
            );

            const loginData = response.data.data;
            if (loginData.token) {
                localStorage.setItem('token', loginData.token);
            }
            setUser(loginData.usuario);
            return true;
        } catch (error) {
            console.error("Falha no login:", error);
            setUser(null);
            return false;
        }
    };


    const logout = async () => {
        try {
            await api.post('/auth/logout');
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error("Erro no logout do servidor, mas limpando o estado localmente.", error);
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('token');
            const apiToUse = token ? api : apiWithoutAuthHeader;

            try {
                const response = await apiToUse.get<AbstractResponse<UsuarioResponse>>('/auth/me');

                if (response.data && response.data.success) {
                    setUser(response.data.data);

                    // Se a resposta vem de um login com Google (sem token no localStorage), opcionalmente, você pode salvar algo no localStorage para manter login:
                    if (!token) {
                        // Não salvar token por segurança, mas indicar que login foi feito com cookie
                        localStorage.setItem('loginWithGoogle', 'true');
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        verifyAuth();
    }, []);

    const isAuthenticated = !!user;

    if (isLoading) {
        return <div>Carregando aplicação...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};