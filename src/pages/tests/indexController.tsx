import { useState, useEffect } from 'react';
import type { TestData, TestFormData, Status } from './indexModel';
import api from '../../api'; // Certifique-se que existe esse serviço
import { useNavigate } from 'react-router-dom';

export function useTestsController() {
    const [tests, setTests] = useState<TestData[]>([]);
    const [filteredTests, setFilteredTests] = useState<TestData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState<TestData | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | ''>('');

    // Simulação de certificações e usuário (substitua por API se necessário)
    const [certificacoes, setCertificacoes] = useState<{ id: number; nome: string; dificuldade: string }[]>([]);
    const [certificacaoFilter, setCertificacaoFilter] = useState<number | ''>(''); // Novo filtro

    const [isSidebarExpanded, setSidebarExpanded] = useState(true);
    const [simulationData, setSimulationData] = useState<any>(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTests() {
            setIsLoading(true);
            try {
                const res = await api.get('/provas');
                let provas: TestData[] = [];
                if (Array.isArray(res.data)) {
                    provas = res.data;
                } else if (Array.isArray(res.data.content)) {
                    provas = res.data.content;
                } else if (Array.isArray(res.data.data)) {
                    provas = res.data.data;
                } else if (res.data && typeof res.data === 'object' && Object.keys(res.data).length > 0) {
                    provas = [res.data];
                }
                setTests(Array.isArray(provas) ? provas : []);
                setIsLoading(false);
            } catch (err) {
                setError('Erro ao carregar provas');
                setIsLoading(false);
            }
        }
        fetchTests();
    }, []);

    useEffect(() => {
        async function fetchCertificacoes() {
            try {
                const res = await api.get('/certificacoes');
                // Supondo que o backend retorna { success, data }
                if (res.data && res.data.success) {
                    setCertificacoes(res.data.data || []);
                } else {
                    setCertificacoes([]);
                }
            } catch {
                setCertificacoes([]);
            }
        }
        fetchCertificacoes();
    }, []);

    useEffect(() => {
        let filtered = tests;
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.certificacao?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter) {
            filtered = filtered.filter(t => t.status === statusFilter);
        }
        if (certificacaoFilter) {
            filtered = filtered.filter(t => t.certificacao.id === certificacaoFilter);
        }
        setFilteredTests(filtered);
    }, [tests, searchTerm, statusFilter, certificacaoFilter]);

    function openCreateModal() {
        setShowCreateModal(true);
        setSelectedTest(null);
    }
    function openEditModal(test: TestData) {
        setShowEditModal(true);
        setSelectedTest(null);
        // Busca os dados atualizados da prova antes de abrir o modal
        api.get(`/provas/${test.id}`)
            .then(res => {
                const prova = res.data?.data || res.data;
                setSelectedTest({
                    id: prova.id,
                    nome: prova.nome,
                    pontuacao: prova.pontuacao ?? 0,
                    tempo: prova.tempo ?? 0,
                    comTempo: prova.comTempo ?? false,
                    status: prova.status ?? 'PENDENTE',
                    certificacao: prova.certificacao ?? { id: 0, nome: '', dificuldade: '' },
                    usuario: prova.usuario ?? { id: 0, nome: '' },
                    numeroDeQuestoes: prova.numeroDeQuestoes ?? 1,
                    dificuldadeQuestoes: prova.dificuldadeQuestoes ?? ''
                });
            })
            .catch(() => {
                setSelectedTest(test);
            });
    }
    function openDeleteModal(test: TestData) {
        setShowDeleteModal(true);
        setSelectedTest(test);
    }
    function closeModals() {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedTest(null);
    }
    async function refreshTests() {
        setIsLoading(true);
        try {
            const res = await api.get('/provas');
            let provas: TestData[] = [];
            if (Array.isArray(res.data)) {
                provas = res.data;
            } else if (Array.isArray(res.data.content)) {
                provas = res.data.content;
            } else if (Array.isArray(res.data.data)) {
                provas = res.data.data;
            } else if (res.data && typeof res.data === 'object' && Object.keys(res.data).length > 0) {
                provas = [res.data];
            }
            setTests(Array.isArray(provas) ? provas : []);
            setIsLoading(false);
        } catch (err) {
            setError('Erro ao carregar provas');
            setIsLoading(false);
        }
    }

    async function handleCreateTest() {
        setIsLoading(true);
        try {
            await refreshTests();
            setShowCreateModal(false);
        } catch (err) {
            setError('Erro ao montar prova');
        }
        setIsLoading(false);
    }

    async function handleEditTest(id: number, data: TestFormData) {
        setIsLoading(true);
        try {
            await api.put(`/provas/${id}`, { ...data, status: 'PENDENTE' });
            await refreshTests();
            setShowEditModal(false);
        } catch (err) {
            setError('Erro ao editar prova');
        }
        setIsLoading(false);
    }

    async function handleDeleteTest(id: number) {
        setIsLoading(true);
        try {
            await api.delete(`/provas/${id}`);
            await refreshTests();
            setShowDeleteModal(false);
        } catch (err) {
            setError('Erro ao deletar prova');
        }
        setIsLoading(false);
    }

    async function handleStartTest(id: number) {
        setIsLoading(true);
        try {
            // Verifica se os dados já estão em cache
            if (simulationData?.prova?.id === id) {
                navigate(`/tests/simulation/${id}`); // Passa o provaId como parâmetro
                return;
            }

            // Busca os dados da prova e inicia a prova
            const provaRes = await api.post(`/provas/${id}/iniciar`);
            const prova = provaRes.data?.data || provaRes.data;

            // Busca questões e alternativas
            let questaoIds: number[] = [];
            if (Array.isArray(prova.questaoIds)) {
                questaoIds = prova.questaoIds;
            } else if (Array.isArray(prova.questoes)) {
                questaoIds = prova.questoes.map((q: any) => typeof q === 'object' ? q.id : q);
            }

            const questoes: { id: number; enunciado: string; alternativas: { id: number; texto: string; correta: boolean }[] }[] = [];
            for (const qid of questaoIds) {
                const questaoRes = await api.get(`/questoes/${qid}`);
                const questao = questaoRes.data?.data || questaoRes.data;

                let alternativaIds: number[] = [];
                if (Array.isArray(questao.alternativas)) {
                    alternativaIds = questao.alternativas.map((a: any) => typeof a === 'object' ? a.id : a);
                } else if (Array.isArray(questao.alternativaIds)) {
                    alternativaIds = questao.alternativaIds;
                }

                const alternativas = [];
                for (const aid of alternativaIds) {
                    const altRes = await api.get(`/alternativas/${aid}`);
                    const alt = altRes.data?.data || altRes.data;
                    alternativas.push({
                        id: alt.id,
                        texto: alt.texto,
                        correta: alt.correta
                    });
                }

                questoes.push({
                    id: questao.id,
                    enunciado: questao.enunciado,
                    alternativas
                });
            }

            // Armazena dados da simulação em cache
            setSimulationData((prev: any) => ({
                ...prev,
                prova,
                questoes
            }));

            navigate(`/tests/simulation/${id}`); // Passa o provaId como parâmetro
        } catch (err) {
            setError('Erro ao iniciar prova');
        }
        setIsLoading(false);
    }

    function handleSearchChange(term: string) {
        setSearchTerm(term);
    }
    function handleStatusFilterChange(status: Status | '') {
        setStatusFilter(status);
    }
    function handleCertificacaoFilterChange(id: number | '') {
        setCertificacaoFilter(id);
    }
    function toggleSidebar() {
        setSidebarExpanded(prev => !prev);
    }

    return {
        filteredTests,
        isLoading,
        error,
        showCreateModal,
        showEditModal,
        showDeleteModal,
        selectedTest,
        searchTerm,
        statusFilter,
        handleCreateTest,
        handleEditTest,
        handleDeleteTest,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        refreshTests,
        handleSearchChange,
        handleStatusFilterChange,
        certificacoes,
        certificacaoFilter,
        handleCertificacaoFilterChange,
        isSidebarExpanded,
        setSidebarExpanded,
        toggleSidebar,
        handleStartTest,
        simulationData,
        setSimulationData
    };
}
