import type { User } from '../../indexModel';

export interface DeactivateAccountModalProps {
    user: User;
    onClose: () => void;
    onDeactivate: (user: User) => void;
}

export interface DeactivateAccountModalState {
    isLoading: boolean;
    error: string;
}

export const DEACTIVATE_ACCOUNT_CONSTANTS = {
    MODAL_TITLE: 'Confirmar Desativação',
    WARNING_TITLE: 'Confirmar Ação',
    WARNING_MESSAGE: 'Tem certeza que deseja desativar sua conta? Você será desconectado imediatamente.',
    DEACTIVATE_BUTTON_TEXT: 'Confirmar',
    DEACTIVATING_BUTTON_TEXT: 'Desativando...',
    CANCEL_BUTTON_TEXT: 'Cancelar'
};