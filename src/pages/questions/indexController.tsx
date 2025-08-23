import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api';
import { QUESTIONS_CONSTANTS } from './indexModel';
import type { Questao, Categoria, Dificuldade } from './indexModel';
import type { AbstractResponse } from '../../interfaces/AbstractInterfaces';
import type { Alternativa } from './components/QuestionModal/indexModel';

export const useQuestionsController = (): {
    questoes: Questao[];
    filteredQuestoes: Questao[];
    isLoading: boolean;
    error: string | null;
    showCreateModal: boolean;
    showEditModal: boolean;
    showDeleteModal: boolean;
    selectedQuestao: Questao | null;
    handleCreateQuestao: (data: Questao) => Promise<void>;
    handleEditQuestao: (id: number, data: Questao) => Promise<void>;
    handleDeleteQuestao: (id: number) => Promise<void>;
    openCreateModal: () => void;
    openEditModal: (questao: Questao) => void;
    openDeleteModal: (questao: Questao) => void;
    closeModals: () => void;
    refreshQuestoes: () => Promise<void>;
    searchTerm: string;
    categoriaFilter: Categoria | '';
    dificuldadeFilter: Dificuldade | '';
    handleSearchChange: (term: string) => void;
    handleCategoriaFilterChange: (categoria: Categoria | '') => void;
    handleDificuldadeFilterChange: (dificuldade: Dificuldade | '') => void;
    clearFilters: () => void;
    isSidebarExpanded: boolean;
    setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSidebar: () => void;
} => {
    const [questoes, setQuestoes] = useState<Questao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuestao, setSelectedQuestao] = useState<Questao | null>(null);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState<Categoria | ''>('');
    const [dificuldadeFilter, setDificuldadeFilter] = useState<Dificuldade | ''>('');
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);

    useEffect(() => {
        loadQuestoes();
    }, []);

    const loadQuestoes = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.get<AbstractResponse<Questao[]>>('/questoes');
            if (response.data.success && Array.isArray(response.data.data)) {
                setQuestoes(response.data.data);
            } else {
                setQuestoes([]);
                setError(response.data.message || QUESTIONS_CONSTANTS.ERROR_LOAD_MESSAGE);
            }
        } catch (error: any) {
            setError(QUESTIONS_CONSTANTS.ERROR_LOAD_MESSAGE);
            setQuestoes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateQuestao = async (data: Questao) => {
        try {
            setError(null);
            const response = await api.post('/questoes', data);
            setQuestoes(prev => [...prev, response.data.data]);
            closeModals();
        } catch (error: any) {
            setError(QUESTIONS_CONSTANTS.ERROR_CREATE_MESSAGE);
            throw error;
        }
    };

    const handleEditQuestao = async (id: number, data: Questao) => {
        try {
            setError(null);
            const response = await api.put(`/questoes/${id}`, data);
            setQuestoes(prev => prev.map(q => q.id === id ? response.data.data : q));
            closeModals();
        } catch (error: any) {
            setError(QUESTIONS_CONSTANTS.ERROR_UPDATE_MESSAGE);
            throw error;
        }
    };

    const handleDeleteQuestao = async (id: number) => {
        try {
            setError(null);
            await api.delete(`/questoes/${id}`);
            setQuestoes(prev => prev.filter(q => q.id !== id));
            closeModals();
        } catch (error: any) {
            setError(QUESTIONS_CONSTANTS.ERROR_DELETE_MESSAGE);
            throw error;
        }
    };

    const openCreateModal = useCallback(() => {
        setSelectedQuestao(null);
        setShowCreateModal(true);
        setError(null);
    }, []);

    const openEditModal = useCallback(async (questao: Questao) => {
        setError(null);
        setShowEditModal(true);
        try {
            // Busca a questão completa
            const response = await api.get<AbstractResponse<Questao>>(`/questoes/${questao.id}`);
            let questaoCompleta = response.data.success && response.data.data ? response.data.data : questao;

            // Busca alternativas usando os ids retornados da questão
            let alternativas: Alternativa[] = [];
            // Garante que está usando o array correto de ids
            const alternativaIds = (questaoCompleta.alternativas || []).map(a => a.id);
            if (alternativaIds.length > 0) {
                const results = await Promise.all(
                    alternativaIds.map(id => api.get<AbstractResponse<Alternativa>>(`/alternativas/${id}`))
                );
                alternativas = results
                    .map(r => r.data.success && r.data.data ? r.data.data : null)
                    .filter(Boolean) as Alternativa[];
            }
            questaoCompleta = {
                ...questaoCompleta,
                alternativas
            };

            setSelectedQuestao(questaoCompleta);
        } catch (error: any) {
            setSelectedQuestao({
                ...questao,
                alternativas: []
            });
            setError(QUESTIONS_CONSTANTS.ERROR_LOAD_MESSAGE);
        }
    }, []);

    const openDeleteModal = useCallback((questao: Questao) => {
        setSelectedQuestao(questao);
        setShowDeleteModal(true);
        setError(null);
    }, []);

    const closeModals = useCallback(() => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedQuestao(null);
        setError(null);
    }, []);

    const refreshQuestoes = useCallback(async () => {
        await loadQuestoes();
    }, []);

    // Filtros e busca
    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const handleCategoriaFilterChange = useCallback((categoria: Categoria | '') => {
        setCategoriaFilter(categoria);
    }, []);

    const handleDificuldadeFilterChange = useCallback((dificuldade: Dificuldade | '') => {
        setDificuldadeFilter(dificuldade);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setCategoriaFilter('');
        setDificuldadeFilter('');
    }, []);

    const toggleSidebar = useCallback(() => {
        setSidebarExpanded(prev => !prev);
    }, []);

    const filteredQuestoes = useMemo(() => {
        return questoes.filter(q => {
            const matchesSearch = q.enunciado.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategoria = !categoriaFilter || q.categoria === categoriaFilter;
            const matchesDificuldade = !dificuldadeFilter || q.dificuldade === dificuldadeFilter;
            return matchesSearch && matchesCategoria && matchesDificuldade;
        });
    }, [questoes, searchTerm, categoriaFilter, dificuldadeFilter]);

    return {
        questoes,
        filteredQuestoes,
        isLoading,
        error,
        showCreateModal,
        showEditModal,
        showDeleteModal,
        selectedQuestao,
        handleCreateQuestao,
        handleEditQuestao,
        handleDeleteQuestao,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        refreshQuestoes,
        searchTerm,
        categoriaFilter,
        dificuldadeFilter,
        handleSearchChange,
        handleCategoriaFilterChange,
        handleDificuldadeFilterChange,
        clearFilters,
        isSidebarExpanded,
        setSidebarExpanded,
        toggleSidebar
    };
};