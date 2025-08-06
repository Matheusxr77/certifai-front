import type { 
    CertificationData, 
    CertificationFormData 
} from '../../indexModel';

export interface CertificationModalProps {
    isOpen: boolean;
    isEdit: boolean;
    certification?: CertificationData | null;
    onSave: (data: CertificationFormData) => Promise<void>;
    onClose: () => void;
}

export interface CertificationModalState {
    formData: CertificationFormData;
    isLoading: boolean;
    errors: Record<string, string>;
}

export interface CertificationModalControllerHook {
    formData: CertificationFormData;
    isLoading: boolean;
    errors: Record<string, string>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleOverlayClick: (e: React.MouseEvent) => void;
    setFormData: React.Dispatch<React.SetStateAction<CertificationFormData>>;
    validateForm: () => boolean;
}

export const CERTIFICATION_MODAL_CONSTANTS = {
    SELECT_DIFFICULTY: 'Selecione o nível',
    VALIDATION_ERRORS: {
        NAME_REQUIRED: 'Nome é obrigatório',
        NAME_MIN_LENGTH: 'Nome deve ter pelo menos 3 caracteres',
        NAME_MAX_LENGTH: 'Nome deve ter no máximo 100 caracteres',
        DIFFICULTY_REQUIRED: 'Dificuldade é obrigatória',
        TIME_POSITIVE: 'Tempo deve ser um número positivo'
    }
};

export type ValidationError = keyof typeof CERTIFICATION_MODAL_CONSTANTS.VALIDATION_ERRORS;