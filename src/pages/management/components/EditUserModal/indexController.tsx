import { 
    useState, 
    useCallback, 
    useEffect 
} from 'react';
import { toast } from 'react-toastify';
import { initialFormData } from './indexModel';
import api from '../../../../api';

import type { User } from '../../indexModel';
import type { 
    EditUserFormData, 
    EditUserErrors 
} from './indexModel';
import type { AbstractResponse } from '../../../../interfaces/AbstractInterfaces';
import type { UsuarioResponse } from '../../../../interfaces/UsuarioInterfaces';

export const useEditUserModalController = (user: User, onUpdate: (user: User) => void, onClose: () => void) => {
    const [formData, setFormData] = useState<EditUserFormData>(initialFormData(user));
    const [errors, setErrors] = useState<EditUserErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleOverlayClick = (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };
    
        // Lock body scroll when modal is open
        useEffect(() => {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }, []);

    // Função para garantir que o token está configurado nas requisições
    const ensureTokenInHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token && !api.defaults.headers.common['Authorization']) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };

    const validateForm = useCallback((): boolean => {
        const newErrors: EditUserErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.role) {
            newErrors.role = 'Perfil é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback((field: keyof EditUserFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof EditUserErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            // Garantir que o token está configurado antes da requisição
            ensureTokenInHeaders();

            const updateData = {
                id: user.id,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                ativo: formData.isActive
            };

            const response = await api.put<AbstractResponse<UsuarioResponse>>(`/usuarios/${user.id}`, updateData);

            if (response.data.success) {
                // Transform response to match our User interface
                const userData = response.data.data;
                const updatedUser: User = {
                    id: String(userData.id),
                    name: userData.name,
                    email: userData.email,
                    role: userData.role as 'ADMIN' | 'PROFESSOR' | 'ESTUDANTE',
                    isActive: userData.isActive !== undefined ? userData.isActive : formData.isActive
                };

                onUpdate(updatedUser);
            } else {
                throw new Error(response.data.message || 'Erro ao atualizar usuário');
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            
            // Verificar se o erro é de autenticação
            if (error?.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                return;
            }
            
            setErrors({ 
                general: error?.response?.data?.message || error?.message || 'Erro ao atualizar usuário' 
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData, user, onUpdate, validateForm]);

    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        onClose,
        handleOverlayClick
    };
};