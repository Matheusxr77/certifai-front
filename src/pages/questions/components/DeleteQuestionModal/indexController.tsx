import { useState } from 'react';
import type { DeleteQuestionModalProps, DeleteQuestionModalState } from './indexModel';

export const useDeleteQuestionModalController = (
    props: DeleteQuestionModalProps
): DeleteQuestionModalState & {
    handleDelete: () => Promise<void>;
} => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await props.onDelete();
        } catch (err: any) {
            setError(err?.message || 'Erro ao excluir questão');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleDelete
    };
};