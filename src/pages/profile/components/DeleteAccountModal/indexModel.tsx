import type { User } from '../../indexModel';

export interface DeleteAccountModalProps {
    user: User;
    onClose: () => void;
    onDelete: (user: User) => void;
}

export interface DeleteAccountModalState {
    isLoading: boolean;
    error: string;
}

export const DELETE_ACCOUNT_CONSTANTS = {
    MODAL_TITLE: 'Confirmar Exclusão',
    WARNING_TITLE: 'Confirmar Ação',
    WARNING_MESSAGE: 'Tem certeza que deseja excluir permanentemente sua conta? Esta ação não pode ser desfeita.',
    DELETE_BUTTON_TEXT: 'Confirmar',
    DELETING_BUTTON_TEXT: 'Excluindo...',
    CANCEL_BUTTON_TEXT: 'Cancelar'
};