import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';
import { useTestsController } from '../../indexController';
import type { SimulationState, SimulationControllerHook } from './indexModel';

export function useSimulationController(provaId: number): SimulationControllerHook {
    const navigate = useNavigate();
    const { } = useTestsController();
    const [state, setState] = useState<SimulationState>({
        currentIndex: 0,
        answers: {},
        finished: false
    });
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSimulationData() {
            if (questions.length > 0) return; // Evita recarregar se já houver questões
            setLoading(true);
            try {
                // Busca os dados da prova
                const provaRes = await api.get(`/provas/${provaId}`);
                const prova = provaRes.data?.data || provaRes.data;

                // Busca questões e alternativas
                let questaoIds: number[] = [];
                if (Array.isArray(prova.questaoIds)) {
                    questaoIds = prova.questaoIds;
                } else if (Array.isArray(prova.questoes)) {
                    questaoIds = prova.questoes.map((q: any) => typeof q === 'object' ? q.id : q);
                }

                const questoes = [];
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

                setQuestions(questoes);
            } catch {
                setQuestions([]);
            }
            setLoading(false);
        }

        if (provaId > 0) {
            fetchSimulationData();
        }
    }, [provaId, questions]);

    // Usar questões do simulationData
    const currentQuestion = questions[state.currentIndex];

    function handleSelectAlternative(alternativaId: number) {
        if (!currentQuestion) return;
        setState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [currentQuestion.id]: alternativaId
            }
        }));
    }

    function handleNext() {
        if (state.currentIndex < questions.length - 1) {
            setState(prev => ({
                ...prev,
                currentIndex: prev.currentIndex + 1
            }));
        } else {
            setState(prev => ({
                ...prev,
                finished: true
            }));
        }
    }

    function handleRestart() {
        setState({
            currentIndex: 0,
            answers: {},
            finished: false
        });
    }

    function getScore() {
        let score = 0;
        questions.forEach((q: { id: number; alternativas: { id: number; correta: boolean }[] }) => {
            const altId = state.answers[q.id];
            const correta = q.alternativas.find((a: { id: number; correta: boolean }) => a.correta);
            if (correta && altId === correta.id) score++;
        });
        return score;
    }

    async function handleFinish() {
        try {
            await api.post(`/provas/${provaId}/finalizar`);
            navigate('/tests');
        } catch (error) {
            console.error('Erro ao finalizar a prova:', error);
        }
    }

    return {
        state,
        currentQuestion,
        handleSelectAlternative,
        handleNext,
        handleRestart,
        getScore,
        questions,
        loading,
        handleFinish
    };
}
