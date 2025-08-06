import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react';
import { CERTIFICATION_MODAL_CONSTANTS } from './indexModel';

import type { 
    CertificationData, 
    CertificationFormData, 
    DifficultyLevel 
} from '../../indexModel';
import type { 
    CertificationModalControllerHook
} from './indexModel';


interface UseCertificationModalControllerProps {
    isOpen: boolean;
    isEdit: boolean;
    certification?: CertificationData | null;
    onSave: (data: CertificationFormData) => Promise<void>;
    onClose: () => void;
}

export const useCertificationModalController = ({
    isOpen,
    isEdit,
    certification,
    onSave,
    onClose
}: UseCertificationModalControllerProps): CertificationModalControllerHook => {
    const [formData, setFormData] = useState<CertificationFormData>({
        nome: '',
        descricao: '',
        dificuldade: '' as DifficultyLevel,
        tempo: undefined
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (isEdit && certification) {
                setFormData({
                    nome: certification.nome,
                    descricao: certification.descricao || '',
                    dificuldade: certification.dificuldade,
                    tempo: certification.tempo
                });
            } else {
                setFormData({
                    nome: '',
                    descricao: '',
                    dificuldade: '' as DifficultyLevel,
                    tempo: undefined
                });
            }
            setErrors({});
            setIsLoading(false);
        }
    }, [isOpen, isEdit, certification]);

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nome.trim()) {
            newErrors.nome = CERTIFICATION_MODAL_CONSTANTS.VALIDATION_ERRORS.NAME_REQUIRED;
        } else if (formData.nome.trim().length < 3) {
            newErrors.nome = CERTIFICATION_MODAL_CONSTANTS.VALIDATION_ERRORS.NAME_MIN_LENGTH;
        } else if (formData.nome.trim().length > 100) {
            newErrors.nome = CERTIFICATION_MODAL_CONSTANTS.VALIDATION_ERRORS.NAME_MAX_LENGTH;
        }

        if (!formData.dificuldade) {
            newErrors.dificuldade = CERTIFICATION_MODAL_CONSTANTS.VALIDATION_ERRORS.DIFFICULTY_REQUIRED;
        }

        if (formData.tempo !== undefined && formData.tempo <= 0) {
            newErrors.tempo = CERTIFICATION_MODAL_CONSTANTS.VALIDATION_ERRORS.TIME_POSITIVE;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            setErrors({});
            await onSave(formData);
        } catch (error) {
            console.error('Modal submit error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateForm, onSave]);

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    }, [onClose, isLoading]);

    return {
        formData,
        isLoading,
        errors,
        handleSubmit,
        handleOverlayClick,
        setFormData,
        validateForm
    };
};