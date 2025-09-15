export interface AlternativaSimulacao {
    id: number;
    texto: string;
    correta: boolean;
}

export interface QuestaoSimulacao {
    id: number;
    enunciado: string;
    alternativas: AlternativaSimulacao[];
}

export interface SimulationState {
    currentIndex: number;
    answers: { [questionId: number]: number };
    finished: boolean;
}

export interface SimulationControllerHook {
    state: SimulationState;
    currentQuestion: QuestaoSimulacao;
    handleSelectAlternative: (alternativaId: number) => void;
    handleNext: () => void;
    handleRestart: () => void;
    getScore: () => number;
    questions: QuestaoSimulacao[];
    loading: boolean;
    handleFinish: () => Promise<void>;
}
