import { useState, useEffect } from 'react';
import api from '../../../../api';
import type { QuestionModalProps, Questao, Alternativa } from './indexModel';

export const useQuestionModalController = ({
    isEdit,
    questao,
    onSave,
    onClose
}: QuestionModalProps) => {
    const [formData, setFormData] = useState<Questao>({
        id: 0,
        enunciado: '',
        categoria: 'NUVEM',
        dificuldade: 'BASICO',
        alternativas: []
    });
    const [questaoId, setQuestaoId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchAlternativas(ids: number[]) {
            if (!ids || ids.length === 0) return [];
            // Faz uma requisição para cada id separadamente
            const results = await Promise.all(
                ids.map(id => api.get<{ data: Alternativa }>(`/alternativas/${id}`))
            );
            return results.map(r => r.data.data);
        }

        if (isEdit && questao) {
            setQuestaoId(questao.id || null);
            let ids: number[] = [];
            if (Array.isArray(questao.alternativas) && questao.alternativas.length > 0) {
                ids = questao.alternativas.map(a => a.id);
            } else if (Array.isArray((questao as any).alternativaIds)) {
                ids = (questao as any).alternativaIds;
            }
            if (ids.length > 0) {
                fetchAlternativas(ids).then(alternativas => {
                    setFormData({
                        ...questao,
                        alternativas
                    });
                });
            } else {
                setFormData({
                    ...questao,
                    alternativas: []
                });
            }
        } else {
            setFormData({
                id: 0,
                enunciado: '',
                categoria: 'NUVEM',
                dificuldade: 'BASICO',
                alternativas: []
            });
            setQuestaoId(null);
        }
    }, [isEdit, questao]);

    const handleAlternativaChange = (index: number, field: keyof Alternativa, value: any) => {
        setFormData(prev => ({
            ...prev,
            alternativas: prev.alternativas.map((alt, i) =>
                i === index ? { ...alt, [field]: value } : alt
            )
        }));
    };

    // Adiciona alternativa localmente
    const addAlternativa = () => {
        setFormData(prev => ({
            ...prev,
            alternativas: [
                ...prev.alternativas,
                { id: -(Date.now()), idQuestao: questaoId || 0, texto: '', correta: false }
            ]
        }));
    };

    // Permite editar alternativas já existentes (não só adicionar novas)
    const saveAlternativa = async (idx: number) => {
        const alt = formData.alternativas[idx];
        if (!questaoId || questaoId <= 0 || !alt.texto.trim()) {
            alert('A questão precisa estar cadastrada antes de salvar alternativas.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            let response;
            if (alt.id > 0) {
                response = await api.put(`/alternativas/${alt.id}`, {
                    texto: alt.texto,
                    correta: alt.correta,
                    questaoId: questaoId
                }, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
            } else {
                response = await api.post('/alternativas', {
                    texto: alt.texto,
                    correta: alt.correta,
                    questaoId: questaoId
                }, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
            }
            const alternativaCriada = response.data?.data;
            setFormData(prev => ({
                ...prev,
                alternativas: prev.alternativas.map((a, i) =>
                    i === idx
                        ? {
                            ...a,
                            id: alternativaCriada?.id || a.id,
                            idQuestao: questaoId
                        }
                        : a
                )
            }));
        } catch (err) {
            alert('Erro ao salvar alternativa.');
        }
    };

    const removeAlternativa = async (index: number) => {
        const alternativa = formData.alternativas[index];
        if (alternativa.id > 0 && questaoId) {
            const token = localStorage.getItem('token');
            try {
                await api.delete(`/alternativas/${alternativa.id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
            } catch {
                // ignore error
            }
        }
        setFormData(prev => ({
            ...prev,
            alternativas: prev.alternativas.filter((_, i) => i !== index)
        }));
    };

    // Cria a questão antes de permitir cadastrar alternativas
    const handleCreateQuestao = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.enunciado.trim()) {
            alert('Enunciado é obrigatório.');
            return;
        }
        if (!['NUVEM', 'DEV', 'BANCO', 'INFRA'].includes(formData.categoria)) {
            alert('Categoria inválida.');
            return;
        }
        if (!['BASICO', 'INTERMEDIARIO', 'AVANCADO'].includes(formData.dificuldade)) {
            alert('Dificuldade inválida.');
            return;
        }
        const token = localStorage.getItem('token');
        const payloadQuestao: any = {
            enunciado: String(formData.enunciado).trim(),
            categoria: String(formData.categoria).trim().toUpperCase(),
            dificuldade: String(formData.dificuldade).trim().toUpperCase()
        };
        try {
            let id = questaoId;
            if (!id || formData.id === 0) {
                const questaoResponse = await api.post('/questoes', payloadQuestao, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                id = questaoResponse.data?.data?.id;
                setQuestaoId(id);
                setFormData(prev => ({
                    ...prev,
                    id: id ?? 0
                }));
            } else {
                onClose();
                return;
            }
        } catch (err: any) {
            alert('Erro ao cadastrar/atualizar questão.');
        }
    };

    // Finaliza cadastro (salva questão e alternativas já cadastradas)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!questaoId) {
            alert('Cadastre a questão antes de finalizar.');
            return;
        }
        if (
            formData.alternativas.length === 0 ||
            !formData.alternativas.some(a => a.correta)
        ) {
            alert('Adicione pelo menos uma alternativa correta.');
            return;
        }
        if (formData.alternativas.length < 2) {
            alert('Adicione pelo menos duas alternativas.');
            return;
        }
        // Se já existe, só fecha o modal sem PUT
        if (questaoId > 0) {
            onClose();
            return;
        }
        await onSave({ ...formData, id: questaoId });
    };

    return {
        formData,
        setFormData,
        handleAlternativaChange,
        addAlternativa,
        saveAlternativa,
        removeAlternativa,
        handleCreateQuestao,
        handleSubmit,
        onClose,
        questaoId
    };
};