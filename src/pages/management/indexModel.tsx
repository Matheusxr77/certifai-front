export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'PROFESSOR' | 'ESTUDANTE';
    isActive: boolean;
}

export interface ManagementState {
    users: User[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    searchTerm: string;
    selectedUser: User | null;
    showEditModal: boolean;
    showDeleteModal: boolean;
}

export interface UserFilters {
    role?: string;
    isActive?: boolean;
    searchTerm?: string;
}

export const ROLE_OPTIONS = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'ESTUDANTE', label: 'Estudante' }
];

export const initialState: ManagementState = {
    users: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchTerm: '',
    selectedUser: null,
    showEditModal: false,
    showDeleteModal: false
};