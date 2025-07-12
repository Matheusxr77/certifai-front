import { 
    useState, 
    useEffect, 
    useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { initialState, ROLE_OPTIONS } from './indexModel';
import { useAuth } from '../../contexts/authContext';
import api from '../../api';

import type { 
    ManagementState, 
    User, 
    UserFilters 
} from './indexModel';
import type { AbstractResponse } from '../../interfaces/AbstractInterfaces';
import type { UsuarioResponse } from '../../interfaces/UsuarioInterfaces';

export const useManagementController = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [state, setState] = useState<ManagementState>(initialState);
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const filteredUsers = state.users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

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

    const toggleSidebar = () => {
        setSidebarExpanded(!isSidebarExpanded);
    };

    // Função para garantir que o token está configurado nas requisições
    const ensureTokenInHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token && !api.defaults.headers.common['Authorization']) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };

    // Check if user has admin role
    const checkAdminAccess = useCallback(() => {
        // Check if user is authenticated first
        if (!isAuthenticated || !user) {
            console.error('User not authenticated or user data not available.');
            navigate('/login');
            return false;
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN') {
            toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
            navigate('/dashboard');
            return false;
        }

        return true;
    }, [navigate, isAuthenticated, user]);

    // Fetch users from API
    const fetchUsers = useCallback(async (filters?: UserFilters) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        try {
            // Garantir que o token está configurado antes da requisição
            ensureTokenInHeaders();

            // Build query parameters
            const queryParams = new URLSearchParams();
            if (filters?.searchTerm) {
                queryParams.append('search', filters.searchTerm);
            }
            if (filters?.role) {
                queryParams.append('role', filters.role);
            }
            if (filters?.isActive !== undefined) {
                queryParams.append('isActive', filters.isActive.toString());
            }

            const endpoint = queryParams.toString() ? `/usuarios?${queryParams}` : '/usuarios';
            const response = await api.get<AbstractResponse<UsuarioResponse[]>>(endpoint);

            if (response.data.success) {
                // Transform the response data to match our User interface
                const allowedRoles = ["ADMIN", "PROFESSOR", "ESTUDANTE"] as const;
                const transformedUsers = response.data.data
                    .filter((user: UsuarioResponse) => allowedRoles.includes(user.role as any))
                    .map((user: UsuarioResponse) => ({
                        id: String(user.id),
                        name: user.name,
                        email: user.email,
                        role: user.role as typeof allowedRoles[number],
                        isActive: user.isActive !== undefined ? user.isActive : true
                    }));
                
                setState(prev => ({
                    ...prev,
                    users: transformedUsers,
                    isLoading: false,
                    totalPages: Math.ceil(transformedUsers.length / 10),
                    currentPage: 1
                }));
            } else {
                throw new Error(response.data.message || 'Erro ao carregar usuários');
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            
            // Verificar se o erro é de autenticação
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            setState(prev => ({
                ...prev,
                error: error?.response?.data?.message || error?.message || 'Erro ao carregar usuários',
                isLoading: false
            }));
        }
    }, [navigate]);

    // Handle search
    const handleSearch = useCallback((searchTerm: string) => {
        setState(prev => ({ ...prev, searchTerm }));
        fetchUsers({ searchTerm });
    }, [fetchUsers]);

    // Handle edit user
    const handleEditUser = useCallback((user: User) => {
        setState(prev => ({
            ...prev,
            selectedUser: user,
            showEditModal: true
        }));
    }, []);

    // Handle delete user
    const handleDeleteUser = useCallback((user: User) => {
        setState(prev => ({
            ...prev,
            selectedUser: user,
            showDeleteModal: true
        }));
    }, []);

    // Close modals
    const closeModals = useCallback(() => {
        setState(prev => ({
            ...prev,
            selectedUser: null,
            showEditModal: false,
            showDeleteModal: false
        }));
    }, []);

    // Handle user update
    const handleUserUpdate = useCallback((updatedUser: User) => {
        setState(prev => ({
            ...prev,
            users: prev.users.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            )
        }));
        closeModals();
        toast.success('Usuário atualizado com sucesso!');
    }, [closeModals]);

    // Handle user deletion
    const handleUserDeletion = useCallback((userId: string) => {
        setState(prev => ({
            ...prev,
            users: prev.users.filter(user => user.id !== userId)
        }));
        closeModals();
        toast.success('Usuário excluído com sucesso!');
    }, [closeModals]);

    // Initialize component - check access first, then load data
    useEffect(() => {
        // Only check access if auth context is ready
        if (user !== undefined) {
            if (checkAdminAccess()) {
                fetchUsers();
            }
        }
    }, [user, checkAdminAccess, fetchUsers]);

    return {
        ...state,
        handleSearch,
        handleEditUser,
        handleDeleteUser,
        closeModals,
        handleUserUpdate,
        handleUserDeletion,
        fetchUsers,
        isSidebarExpanded,
        toggleSidebar,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        filteredUsers,
        getRoleLabel,
        getRoleClass
    };
};