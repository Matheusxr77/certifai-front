import type { User } from '../../indexModel';

export interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onUpdate: (user: User) => void;
}

export interface EditUserFormData {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

export interface EditUserErrors {
    name?: string;
    email?: string;
    role?: string;
    general?: string;
}

export const initialFormData = (user: User): EditUserFormData => ({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive
});