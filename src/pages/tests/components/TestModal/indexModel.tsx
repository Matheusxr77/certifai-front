import type { TestData, TestFormData } from '../../indexModel';

export interface TestModalProps {
    isOpen: boolean;
    isEdit: boolean;
    test?: TestData | null;
    certificacoes: { 
        id: number; 
        nome: string; 
        dificuldade: string; 
    }[];
    onSave: (data: TestFormData) => Promise<void>;
    onClose: () => void;
}

export interface TestModalState {
    formData: TestFormData;
    isLoading: boolean;
    errors: Record<string, string>;
}

export const TEST_MODAL_CONSTANTS = {
    SELECT_STATUS: 'Selecione o status',
    SELECT_CERTIFICATION: 'Selecione a certificação',
    VALIDATION_ERRORS: {
        NAME_REQUIRED: 'Nome é obrigatório',
        SCORE_REQUIRED: 'Pontuação é obrigatória',
        TIME_REQUIRED: 'Tempo é obrigatório',
        STATUS_REQUIRED: 'Status é obrigatório',
        CERTIFICATION_REQUIRED: 'Certificação é obrigatória'
    }
};

export type ValidationError = keyof typeof TEST_MODAL_CONSTANTS.VALIDATION_ERRORS;
