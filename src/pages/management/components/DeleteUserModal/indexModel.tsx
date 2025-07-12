import type { User } from '../../indexModel';

export interface DeleteUserModalProps {
    user: User;
    onClose: () => void;
    onDelete: (userId: string) => void;
}

export interface DeleteUserState {
    isLoading: boolean;
    error: string | null;
}