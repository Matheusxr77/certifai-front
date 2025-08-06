import type { CertificationData } from '../../indexModel';

export interface DeleteCertificationModalProps {
    isOpen: boolean;
    certification: CertificationData;
    onDelete: () => Promise<void>;
    onClose: () => void;
}
export interface UseDeleteCertificationModalControllerProps {
    certification: CertificationData;
    onDelete: () => Promise<void>;
    onClose: () => void;
}

export interface DeleteCertificationModalState {
    isLoading: boolean;
}

export interface DeleteCertificationModalControllerHook {
    isLoading: boolean;
    handleDelete: () => Promise<void>;
    handleOverlayClick: (e: React.MouseEvent) => void;
}

export const DELETE_CERTIFICATION_MODAL_CONSTANTS = {
    CONFIRM_MESSAGE: 'Tem certeza que deseja excluir esta certificação',
    WARNING_MESSAGE: 'Esta ação não pode ser desfeita.',
    INFO_LABELS: {
        NAME: 'Nome:',
        DESCRIPTION: 'Descrição:'
    }
};