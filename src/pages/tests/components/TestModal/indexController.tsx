import { useState, useEffect } from 'react';
import api from '../../../../api'; // Importa o client de API
import type { TestModalProps } from './indexModel';
import type { TestFormData } from '../../indexModel';
import { TEST_MODAL_CONSTANTS } from './indexModel';

export function useTestModalController(props: TestModalProps) {
    const { isEdit, test, onSave, onClose } = props;

    const [certificacoes, setCertificacoes] = useState<any[]>([]);
    const [isCertificacoesLoading, setIsCertificacoesLoading] = useState(true);

    const [formData, setFormData] = useState<TestFormData>({
        nome: test?.nome || '',
        pontuacao: test?.pontuacao || 0,
        tempo: test?.tempo || 0,
        comTempo: test?.comTempo || false,
        status: test?.status || 'PENDENTE',
        certificacaoId: test?.certificacao?.id || 0,
        numeroDeQuestoes: test?.numeroDeQuestoes ?? 1,
        dificuldadeQuestoes: test?.dificuldadeQuestoes ?? ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [/*usuarioId*/, setUsuarioId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchCertificacoes() {
            setIsCertificacoesLoading(true);
            try {
                const response = await api.get('/certificacoes');
                if (response.data.success) {
                    setCertificacoes(response.data.data || []);
                } else {
                    setCertificacoes([]);
                }
            } catch {
                setCertificacoes([]);
            } finally {
                setIsCertificacoesLoading(false);
            }
        }
        fetchCertificacoes();
    }, []);

    useEffect(() => {
        async function fetchUsuarioId() {
            try {
                const userRes = await api.get('/auth/me');
                const id = userRes.data?.id;
                if (id && !isNaN(Number(id)) && Number(id) > 0) {
                    setUsuarioId(Number(id));
                } else {
                    setUsuarioId(null);
                }
            } catch {
                setUsuarioId(null);
            }
        }
        fetchUsuarioId();
    }, [props.isOpen]);

    useEffect(() => {
        async function fetchTestData() {
            if (isEdit && test && test.id) {
                try {
                    const res = await api.get(`/provas/${test.id}`);
                    const prova = res.data?.data || res.data;
                    setFormData({
                        nome: prova.nome,
                        pontuacao: prova.pontuacao ?? 0,
                        tempo: prova.tempo ?? 0,
                        comTempo: prova.comTempo ?? false,
                        status: 'PENDENTE',
                        certificacaoId: prova.certificacao?.id ?? 0,
                        numeroDeQuestoes: prova.numeroDeQuestoes ?? 1,
                        dificuldadeQuestoes: prova.dificuldadeQuestoes ?? ''
                    });
                } catch {
                    setFormData({
                        nome: test.nome,
                        pontuacao: test.pontuacao,
                        tempo: test.tempo,
                        comTempo: test.comTempo,
                        status: 'PENDENTE',
                        certificacaoId: test.certificacao?.id ?? 0,
                        numeroDeQuestoes: test.numeroDeQuestoes ?? 1,
                        dificuldadeQuestoes: test.dificuldadeQuestoes ?? ''
                    });
                }
            } else {
                setFormData({
                    nome: '',
                    pontuacao: 0,
                    tempo: 0,
                    comTempo: false,
                    status: 'PENDENTE',
                    certificacaoId: certificacoes[0]?.id ?? 0,
                    numeroDeQuestoes: 1,
                    dificuldadeQuestoes: ''
                });
            }
            setErrors({});
        }
        fetchTestData();
        // eslint-disable-next-line
    }, [isEdit, test, certificacoes]);

    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};
        if (!formData.nome) newErrors.nome = TEST_MODAL_CONSTANTS.VALIDATION_ERRORS.NAME_REQUIRED;
        if (!formData.pontuacao) newErrors.pontuacao = TEST_MODAL_CONSTANTS.VALIDATION_ERRORS.SCORE_REQUIRED;
        if (formData.comTempo && !formData.tempo) newErrors.tempo = TEST_MODAL_CONSTANTS.VALIDATION_ERRORS.TIME_REQUIRED;
        if (!formData.certificacaoId) newErrors.certificacaoId = TEST_MODAL_CONSTANTS.VALIDATION_ERRORS.CERTIFICATION_REQUIRED;
        if (!formData.numeroDeQuestoes || formData.numeroDeQuestoes < 1) newErrors.numeroDeQuestoes = 'Número de questões deve ser no mínimo 1.';
        if (!formData.dificuldadeQuestoes) newErrors.dificuldadeQuestoes = 'Dificuldade é obrigatória.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        //if (!validateForm()) return;
        setIsLoading(true);
        try {
            // Busca o usuário logado via /auth/me antes de montar a prova
            const userRes = await api.get('/auth/me');
            // O id pode estar em userRes.data.id ou userRes.data.data.id dependendo do backend
            let usuarioId = userRes.data?.id;
            if (!usuarioId && userRes.data?.data?.id) {
                usuarioId = userRes.data.data.id;
            }
            if (!usuarioId || isNaN(Number(usuarioId)) || Number(usuarioId) <= 0) {
                setErrors({ geral: 'Usuário não identificado. Faça login novamente.' });
                setIsLoading(false);
                return;
            }
            const payload = {
                ...formData,
                usuarioId
            };
            await api.post('/provas/montar-personalizada', payload);
            await onSave(payload);
        } catch (err) {
            setErrors({ geral: 'Erro ao montar prova personalizada.' });
        }
        setIsLoading(false);
    }

    function handleOverlayClick(e: React.MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
            onClose();
        }
    }

    return {
        formData,
        isLoading,
        errors,
        setFormData,
        handleSubmit,
        handleOverlayClick,
        validateForm,
        certificacoes,
        isCertificacoesLoading
    };
}