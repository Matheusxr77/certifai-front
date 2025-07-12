import { 
    useState, 
    useCallback, 
    useEffect 
} from 'react';
import { toast } from 'react-toastify';
import { ROLE_OPTIONS } from '../../indexModel';
import api from '../../../../api';

import type { User } from '../../indexModel';
import type { DeleteUserState } from './indexModel';
import type { AbstractResponse } from '../../../../interfaces/AbstractInterfaces';

export const useDeleteUserModalController = (user: User, onDelete: (userId: string) => void, onClose: () => void) => {
    const [state, setState] = useState<DeleteUserState>({
        isLoading: false,
        error: null
    });

    useEffect(() => {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }, []);

    const handleOverlayClick = (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };
    
        const getRoleLabel = (role: string) => {
            return ROLE_OPTIONS.find(option => option.value === role)?.label || role;
        };
    
        const getRoleClass = (role: string) => {
            const roleClasses = {
                ADMIN: 'role-admin',
                PROFESSOR: 'role-professor',
                STUDENT: 'role-student'
            };
            return roleClasses[role as keyof typeof roleClasses] || 'role-default';
        };

    // Função para garantir que o token está configurado nas requisições
    const ensureTokenInHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token && !api.defaults.headers.common['Authorization']) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };

    const handleDelete = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Garantir que o token está configurado antes da requisição
            ensureTokenInHeaders();

            const response = await api.delete<AbstractResponse<void>>(`/usuarios/${user.id}`);

            if (response.data.success) {
                onDelete(user.id);
            } else {
                throw new Error(response.data.message || 'Erro ao excluir usuário');
            }
        } catch (error: any) {
            console.error('Error deleting user:', error);
            
            // Verificar se o erro é de autenticação
            if (error?.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                return;
            }
            
            setState(prev => ({ 
                ...prev, 
                error: error?.response?.data?.message || error?.message || 'Erro ao excluir usuário',
                isLoading: false 
            }));
        }
    }, [user.id, onDelete]);

    return {
        ...state,
        handleDelete,
        onClose,
        handleOverlayClick,
        getRoleLabel,
        getRoleClass
    };
};