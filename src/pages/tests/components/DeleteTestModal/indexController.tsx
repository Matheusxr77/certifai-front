import { useState } from 'react';
import type { DeleteTestModalProps } from './indexModel';

export function useDeleteTestModalController(props: DeleteTestModalProps) {
    const { onDelete, onClose } = props;
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        setIsLoading(true);
        await onDelete();
        setIsLoading(false);
    }

    function handleOverlayClick(e: React.MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
            onClose();
        }
    }

    return {
        isLoading,
        handleDelete,
        handleOverlayClick
    };
}
