import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/authContext';
import api from '../../api';
import apiWithoutAuthHeader from '../../apiSemHeader';
import {
    PROFILE_CONSTANTS,
    PROFILE_ERROR_MESSAGES,
    ROLE_OPTIONS
} from './indexModel';

import type {
    ProfileControllerHook,
    ProfileData,
    ProfileErrorType,
    NovaSenhaRequest
} from './indexModel';
import type { AbstractResponse } from '../../interfaces/AbstractInterfaces';
import type { UsuarioResponse } from '../../interfaces/UsuarioInterfaces';

export const useProfileController = (): ProfileControllerHook => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Estados para alteração de senha
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    
    // Estados para desativar usuário
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [showDeactivateForm, setShowDeactivateForm] = useState(false);
    
    // Estados para excluir usuário
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    
    // Estados para atualizar perfil
    const [showProfileForm, setShowProfileForm] = useState(false);

    const { user, logout } = useAuth();

    // Validação de senha
    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    };

    const getRoleDescription = (role: string): string => {
        const option = ROLE_OPTIONS.find(opt => opt.value === role);
        return option ? option.description : 'Tipo de perfil não definido';
    };

    const getRoleLabel = (role: string): string => {
        const option = ROLE_OPTIONS.find(opt => opt.value === role);
        return option ? option.label : role;
    };

    const ensureTokenInHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token && !api.defaults.headers.common['Authorization']) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };

    useEffect(() => {
        ensureTokenInHeaders();
        loadProfileData();
    }, []);


    const loadProfileData = async () => {
    try {
        setIsLoading(true);
        setError(null);

        const isOAuthLogin = !localStorage.getItem("token");
        const client = isOAuthLogin ? apiWithoutAuthHeader : api;

        const response = await client.get<AbstractResponse<UsuarioResponse>>(`/auth/me`);

        if (response.data.success) {
            const userData = response.data.data;

            const profileData: ProfileData = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role
            };

            setProfileData(profileData);
            setSelectedRole(userData.role);

            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            throw new Error(response.data.message || 'UNKNOWN_ERROR');
        }
    } catch (error: any) {
        console.error('Load profile error:', error);

        if (error?.response?.status === 401) {
            toast.error('Sessão expirada. Faça login novamente.');
            logout();
            return;
        }

        const errorType = getErrorType(error);
        const errorMessage = getErrorMessage(errorType);
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
};

    const handleUpdateProfile = async (event: React.FormEvent) => {
        event.preventDefault();
        ensureTokenInHeaders();
        
        const currentUser = user || (() => {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        })();

        if (!currentUser?.id) {
            setError('ID do usuário não disponível');
            return;
        }
        
        if (!validateForm()) {
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            setSuccess(null);

            const updateData = {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                role: selectedRole,
                ativo: true
            };

            const isOAuthLogin = !localStorage.getItem("token");
            const client = isOAuthLogin ? apiWithoutAuthHeader : api;

            const response = await client.put<AbstractResponse<UsuarioResponse>>(`/usuarios/${currentUser.id}`, updateData);
            
            if (response.data.success) {
                const userData = response.data.data;
                const updatedProfile: ProfileData = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role
                };
                setProfileData(updatedProfile);
                setSelectedRole(userData.role);
                
                const updatedUser = { ...currentUser, role: userData.role };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                setSuccess(PROFILE_CONSTANTS.SUCCESS_MESSAGE);
                toast.success(PROFILE_CONSTANTS.SUCCESS_MESSAGE);
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }

            setTimeout(() => {
                setSuccess(null);
            }, PROFILE_CONSTANTS.REFRESH_DELAY);

        } catch (error) {
            console.error('Profile update error:', error);
            
            if (error === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                logout();
                return;
            }
            
            const errorType = getErrorType(error);
            const errorMessage = getErrorMessage(errorType);
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        setError(null);
        setSuccess(null);
    };

    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const currentUser = user || (() => {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        })();

        if (!currentUser?.id) {
            setError('ID do usuário não disponível');
            return;
        }
        
        if (!validatePasswordForm()) {
            return;
        }

        try {
            setIsChangingPassword(true);
            setError(null);
            setSuccess(null);

            ensureTokenInHeaders();

            const passwordData: NovaSenhaRequest = {
                senhaAntiga: currentPassword,
                novaSenha: newPassword,
                confirmarNovaSenha: confirmPassword
            };

            const isOAuthLogin = !localStorage.getItem("token");
            const client = isOAuthLogin ? apiWithoutAuthHeader : api;

            const response = await client.patch<AbstractResponse<void>>(`/usuarios/${currentUser.id}/senha`, passwordData);
            
            if (response.data.success) {
                setSuccess(PROFILE_CONSTANTS.PASSWORD_SUCCESS_MESSAGE);
                toast.success(PROFILE_CONSTANTS.PASSWORD_SUCCESS_MESSAGE);
                
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordForm(false);
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }

            setTimeout(() => {
                setSuccess(null);
            }, PROFILE_CONSTANTS.REFRESH_DELAY);

        } catch (error: any) {
            console.error('Password change error:', error);
            
            if (error?.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                logout();
                return;
            }
            
            if (error?.response?.status === 400 || error?.response?.data?.message?.includes('senha atual')) {
                setError(PROFILE_ERROR_MESSAGES.CURRENT_PASSWORD_WRONG);
                toast.error(PROFILE_ERROR_MESSAGES.CURRENT_PASSWORD_WRONG);
            } else {
                const errorType = getErrorType(error);
                const errorMessage = getErrorMessage(errorType);
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDeactivateUser = async () => {
        const currentUser = user || (() => {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        })();

        if (!currentUser?.id) {
            setError('ID do usuário não disponível');
            return;
        }

        const confirmed = window.confirm(
            'Tem certeza que deseja desativar sua conta? Esta ação irá desconectá-lo imediatamente e sua conta ficará inativa.'
        );
        
        if (!confirmed) return;

        try {
            setIsDeactivating(true);
            setError(null);
            setSuccess(null);

            ensureTokenInHeaders();

            const response = await api.patch<AbstractResponse<void>>(`/usuarios/${currentUser.id}/desativar`, {
                id: currentUser.id,
                ativo: false
            });
            
            if (response.data.success) {
                setSuccess(PROFILE_CONSTANTS.DEACTIVATE_SUCCESS_MESSAGE);
                toast.success(PROFILE_CONSTANTS.DEACTIVATE_SUCCESS_MESSAGE);

                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                
                setTimeout(() => {
                    logout();
                }, 2000);
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }

        } catch (error: any) {
            console.error('Deactivate user error:', error);
            
            if (error?.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                logout();
                return;
            }
            
            if (error?.response?.status === 403) {
                setError(PROFILE_ERROR_MESSAGES.DEACTIVATE_UNAUTHORIZED);
                toast.error(PROFILE_ERROR_MESSAGES.DEACTIVATE_UNAUTHORIZED);
            } else {
                setError(PROFILE_ERROR_MESSAGES.DEACTIVATE_ERROR);
                toast.error(PROFILE_ERROR_MESSAGES.DEACTIVATE_ERROR);
            }
        } finally {
            setIsDeactivating(false);
        }
    };

    const handleDeleteAccount = async () => {
        const currentUser = user || (() => {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        })();

        if (!currentUser?.id) {
            setError('ID do usuário não disponível');
            return;
        }

        const confirmed = window.confirm(
            'Tem certeza que deseja excluir permanentemente sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.'
        );
        
        if (!confirmed) return;

        try {
            setIsDeleting(true);
            setError(null);
            setSuccess(null);

            ensureTokenInHeaders();

            const response = await api.delete<AbstractResponse<void>>(`/usuarios/${currentUser.id}`);
            
            if (response.data.success) {
                setSuccess(PROFILE_CONSTANTS.DELETE_SUCCESS_MESSAGE);
                toast.success(PROFILE_CONSTANTS.DELETE_SUCCESS_MESSAGE);
                
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                
                setTimeout(() => {
                    logout();
                    window.location.href = '/login';
                }, 2000);
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }

        } catch (error: any) {
            console.error('Delete account error:', error);
            
            if (error?.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                logout();
                return;
            }
            
            // Tratamento específico para erro de exclusão
            if (error?.response?.status === 403) {
                setError(PROFILE_ERROR_MESSAGES.DELETE_UNAUTHORIZED);
                toast.error(PROFILE_ERROR_MESSAGES.DELETE_UNAUTHORIZED);
            } else {
                setError(PROFILE_ERROR_MESSAGES.DELETE_ERROR);
                toast.error(PROFILE_ERROR_MESSAGES.DELETE_ERROR);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const validateForm = (): boolean => {
        if (!selectedRole) {
            setError(PROFILE_CONSTANTS.VALIDATION_ERROR);
            toast.error(PROFILE_CONSTANTS.VALIDATION_ERROR);
            return false;
        }

        if (!ROLE_OPTIONS.find(option => option.value === selectedRole)) {
            setError(PROFILE_CONSTANTS.VALIDATION_ERROR);
            toast.error(PROFILE_CONSTANTS.VALIDATION_ERROR);
            return false;
        }

        return true;
    };

    const validatePasswordForm = (): boolean => {
        if (!currentPassword.trim()) {
            setError(PROFILE_ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED);
            toast.error(PROFILE_ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED);
            return false;
        }

        if (!newPassword.trim()) {
            setError(PROFILE_ERROR_MESSAGES.NEW_PASSWORD_REQUIRED);
            toast.error(PROFILE_ERROR_MESSAGES.NEW_PASSWORD_REQUIRED);
            return false;
        }

        if (!validatePassword(newPassword.trim())) {
            setError(PROFILE_ERROR_MESSAGES.PASSWORD_WEAK);
            toast.error(PROFILE_ERROR_MESSAGES.PASSWORD_WEAK);
            return false;
        }

        if (!confirmPassword.trim()) {
            setError(PROFILE_ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED);
            toast.error(PROFILE_ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED);
            return false;
        }

        if (!validatePasswordMatch(newPassword.trim(), confirmPassword.trim())) {
            setError(PROFILE_ERROR_MESSAGES.PASSWORDS_DONT_MATCH);
            toast.error(PROFILE_ERROR_MESSAGES.PASSWORDS_DONT_MATCH);
            return false;
        }

        if (currentPassword.trim() === newPassword.trim()) {
            setError(PROFILE_ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
            toast.error(PROFILE_ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
            return false;
        }

        return true;
    };

    const getErrorType = (error: any): ProfileErrorType => {
        if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
            return 'NETWORK_ERROR';
        } else if (error?.response?.status === 401) {
            return 'UNAUTHORIZED';
        } else if (error?.response?.status === 404) {
            return 'NOT_FOUND';
        } else if (error?.response?.status >= 500) {
            return 'SERVER_ERROR';
        } else {
            return 'UNKNOWN_ERROR';
        }
    };

    const getErrorMessage = (errorType: ProfileErrorType): string => {
        return PROFILE_ERROR_MESSAGES[errorType] || PROFILE_ERROR_MESSAGES.UNKNOWN_ERROR;
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const refreshProfile = async () => {
        await loadProfileData();
    };

    return {
        profileData,
        selectedRole,
        setSelectedRole,
        isLoading,
        isSaving,
        error,
        success,
        handleUpdateProfile,
        handleRoleChange,
        clearMessages,
        refreshProfile,
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        isChangingPassword,
        handlePasswordChange,
        showPasswordForm,
        setShowPasswordForm,
        isDeactivating,
        handleDeactivateUser,
        showDeactivateForm,
        setShowDeactivateForm,
        isDeleting,
        handleDeleteAccount,
        showDeleteForm,
        setShowDeleteForm,
        showProfileForm,
        setShowProfileForm,
        getRoleDescription,
        getRoleLabel
    };
};