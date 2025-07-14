import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react';
import { toast } from 'react-toastify';
import api from '../../../../api';
import apiWithoutAuthHeader from '../../../../apiSemHeader';
import { ROLE_OPTIONS } from '../../indexModel';

import type { User } from '../../indexModel';
import type { DeleteAccountModalState } from './indexModel';
import type { AbstractResponse } from '../../../../interfaces/AbstractInterfaces';

export const useDeleteAccountModalController = (
    user: User, 
    onDelete: (user: User) => void, 
    onClose: () => void
) => {
    const [state, setState] = useState<DeleteAccountModalState>({
        isLoading: false,
        error: ''
    });

    // Função para garantir que o token está configurado nas requisições
    const ensureTokenInHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token && !api.defaults.headers.common['Authorization']) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const getRoleLabel = useCallback((role: string) => {
        return ROLE_OPTIONS.find(option => option.value === role)?.label || role;
    }, []);

    const getRoleClass = useCallback((role: string) => {
        const roleClasses = {
            ADMIN: 'role-admin',
            PROFESSOR: 'role-professor',
            ESTUDANTE: 'role-student'
        };
        return roleClasses[role as keyof typeof roleClasses] || 'role-default';
    }, []);

    const handleDelete = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: '' }));
        
        try {
            // Garantir que o token está configurado antes da requisição
            ensureTokenInHeaders();

            const isOAuthLogin = !localStorage.getItem("token");
            const client = isOAuthLogin ? apiWithoutAuthHeader : api;

            const response = await client.delete<AbstractResponse<any>>(`/usuarios/${user.id}`);
            
            if (response.data.success) {
                toast.success('Conta excluída com sucesso');
                onDelete(user);
                onClose();
            } else {
                throw new Error(response.data.message || 'Erro ao excluir conta');
            }
        } catch (error: any) {
            console.error('Erro ao excluir conta:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao excluir conta';
            
            setState(prev => ({ 
                ...prev, 
                error: errorMessage,
                isLoading: false 
            }));
            
            toast.error(errorMessage);
        }
    }, [user, onDelete, onClose]);

    return {
        ...state,
        handleDelete,
        handleOverlayClick,
        getRoleLabel,
        getRoleClass
    };
};