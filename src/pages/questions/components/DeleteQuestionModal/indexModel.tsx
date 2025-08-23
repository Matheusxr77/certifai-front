import type { Questao } from '../../indexModel';

export interface DeleteQuestionModalProps {
    isOpen: boolean;
    questao: Questao;
    onDelete: () => Promise<void>;
    onClose: () => void;
}

export interface DeleteQuestionModalState {
    isLoading: boolean;
    error?: string | null;
}