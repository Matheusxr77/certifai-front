import { 
    useState, 
    useEffect, 
    useCallback, 
    useMemo 
} from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import {
    CERTIFICATIONS_CONSTANTS,
    CERTIFICATIONS_ERROR_MESSAGES,
    DIFFICULTY_OPTIONS
} from './indexModel';

import type {
    CertificationsControllerHook,
    CertificationData,
    CertificationFormData,
    DifficultyLevel,
    CertificationsErrorType
} from './indexModel';
import type { AbstractResponse } from '../../interfaces/AbstractInterfaces';

export const useCertificationsController = (): CertificationsControllerHook => {
    const [certifications, setCertifications] = useState<CertificationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCertification, setSelectedCertification] = useState<CertificationData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | ''>('');

    useEffect(() => {
        loadCertifications();
    }, []);

    const loadCertifications = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.get<AbstractResponse<CertificationData[]>>('/certificacoes');
            
            if (response.data.success) {
                setCertifications(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }
        } catch (error: any) {
            const errorType = getErrorType(error);
            const errorMessage = getErrorMessage(errorType);
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCertification = async (data: CertificationFormData) => {
        try {
            setError(null);
            setSuccess(null);

            const response = await api.post<AbstractResponse<CertificationData>>('/certificacoes', data);
            
            if (response.data.success) {
                setCertifications(prev => [...prev, response.data.data]);
                setSuccess(CERTIFICATIONS_CONSTANTS.SUCCESS_CREATE_MESSAGE);
                toast.success(CERTIFICATIONS_CONSTANTS.SUCCESS_CREATE_MESSAGE);
                closeModals();
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }
        } catch (error: any) {
            const errorType = getErrorType(error);
            const errorMessage = getErrorMessage(errorType);
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleEditCertification = async (id: number, data: CertificationFormData) => {
        try {
            setError(null);
            setSuccess(null);

            const response = await api.put<AbstractResponse<CertificationData>>(`/certificacoes/${id}`, data);
            
            if (response.data.success) {
                setCertifications(prev => 
                    prev.map(cert => cert.id === id ? response.data.data : cert)
                );
                setSuccess(CERTIFICATIONS_CONSTANTS.SUCCESS_UPDATE_MESSAGE);
                toast.success(CERTIFICATIONS_CONSTANTS.SUCCESS_UPDATE_MESSAGE);
                closeModals();
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }
        } catch (error: any) {
            const errorType = getErrorType(error);
            const errorMessage = getErrorMessage(errorType);
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleDeleteCertification = async (id: number) => {
        try {
            setError(null);
            setSuccess(null);

            const response = await api.delete<AbstractResponse<void>>(`/certificacoes/${id}`);
            
            if (response.data.success) {
                setCertifications(prev => prev.filter(cert => cert.id !== id));
                setSuccess(CERTIFICATIONS_CONSTANTS.SUCCESS_DELETE_MESSAGE);
                toast.success(CERTIFICATIONS_CONSTANTS.SUCCESS_DELETE_MESSAGE);
                closeModals();
            } else {
                throw new Error(response.data.message || 'UNKNOWN_ERROR');
            }
        } catch (error: any) {
            const errorType = getErrorType(error);
            const errorMessage = getErrorMessage(errorType);
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        }
    };

    const openCreateModal = useCallback(() => {
        setSelectedCertification(null);
        setShowCreateModal(true);
        setError(null);
        setSuccess(null);
    }, []);

    const openEditModal = useCallback((certification: CertificationData) => {
        setSelectedCertification(certification);
        setShowEditModal(true);
        setError(null);
        setSuccess(null);
    }, []);

    const openDeleteModal = useCallback((certification: CertificationData) => {
        setSelectedCertification(certification);
        setShowDeleteModal(true);
        setError(null);
        setSuccess(null);
    }, []);

    const closeModals = useCallback(() => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedCertification(null);
        setError(null);
        setSuccess(null);
    }, []);

    const refreshCertifications = useCallback(async () => {
        await loadCertifications();
    }, []);

    const getDifficultyLabel = useCallback((difficulty: DifficultyLevel): string => {
        const option = DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty);
        return option ? option.label : difficulty;
    }, []);

    const getDifficultyColor = useCallback((difficulty: DifficultyLevel): string => {
        switch (difficulty) {
            case 'BASICO':
                return '#10b981';
            case 'INTERMEDIARIO':
                return '#f59e0b';
            case 'AVANCADO':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    }, []);

    const formatTime = useCallback((timeInMinutes?: number): string => {
        if (!timeInMinutes) return 'Não definido';
        
        if (timeInMinutes < 60) {
            return `${timeInMinutes} min`;
        }
        
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        
        if (minutes === 0) {
            return `${hours}h`;
        }
        
        return `${hours}h ${minutes}min`;
    }, []);

    const getErrorType = (error: any): CertificationsErrorType => {
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

    const getErrorMessage = (errorType: CertificationsErrorType): string => {
        return CERTIFICATIONS_ERROR_MESSAGES[errorType] || CERTIFICATIONS_ERROR_MESSAGES.UNKNOWN_ERROR;
    };

    const filteredCertifications = useMemo(() => {
        return certifications.filter(certification => {
            const matchesSearch = certification.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDifficulty = !difficultyFilter || certification.dificuldade === difficultyFilter;
            
            return matchesSearch && matchesDifficulty;
        });
    }, [certifications, searchTerm, difficultyFilter]);

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const handleDifficultyFilterChange = useCallback((difficulty: DifficultyLevel | '') => {
        setDifficultyFilter(difficulty);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setDifficultyFilter('');
    }, []);

    return {
        certifications,
        filteredCertifications,
        isLoading,
        error,
        success,
        showCreateModal,
        showEditModal,
        showDeleteModal,
        selectedCertification,
        searchTerm,
        difficultyFilter,
        handleCreateCertification,
        handleEditCertification,
        handleDeleteCertification,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        refreshCertifications,
        getDifficultyLabel,
        getDifficultyColor,
        formatTime,
        handleSearchChange,
        handleDifficultyFilterChange,
        clearFilters
    };
};