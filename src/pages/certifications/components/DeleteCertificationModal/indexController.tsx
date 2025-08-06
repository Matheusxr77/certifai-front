import { 
    useState, 
    useCallback 
} from 'react';

import type { 
    DeleteCertificationModalControllerHook, 
    UseDeleteCertificationModalControllerProps 
} from './indexModel';

export const useDeleteCertificationModalController = ({
    onDelete,
    onClose
}: UseDeleteCertificationModalControllerProps): DeleteCertificationModalControllerHook => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = useCallback(async () => {
        try {
            setIsLoading(true);
            await onDelete();
        } catch (error) {
            console.error('Delete modal error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [onDelete]);

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    }, [onClose, isLoading]);

    return {
        isLoading,
        handleDelete,
        handleOverlayClick
    };
};