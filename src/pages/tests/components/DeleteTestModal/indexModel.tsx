import type { TestData } from '../../indexModel';

export interface DeleteTestModalProps {
    isOpen: boolean;
    test: TestData;
    onDelete: () => Promise<void>;
    onClose: () => void;
}

export interface DeleteTestModalState {
    isLoading: boolean;
    error?: string | null;
}

export const DELETE_TEST_MODAL_CONSTANTS = {
    CONFIRM_MESSAGE: 'Tem certeza que deseja excluir a prova',
    INFO_LABELS: {
        CERTIFICATION: 'Certificação',
        SCORE: 'Pontuação',
        TIME: 'Tempo',
        STATUS: 'Status'
    }
};
