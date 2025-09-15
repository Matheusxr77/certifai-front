import { useState, useEffect, useCallback } from 'react';
import type { PerformanceItem, PerformanceControllerHook } from './indexModel';

// Adicione o campo mediaAcertos ao tipo PerformanceItem
type PerformanceItemWithMedia = PerformanceItem & { mediaAcertos: number };

export function usePerformanceController(): PerformanceControllerHook {
    const [data, setData] = useState<PerformanceItemWithMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // MOCK: Dados simulados com média de acertos
            const mockData: PerformanceItemWithMedia[] = [
                { provaId: 1, provaNome: 'vercel', acertos: 7, erros: 3, mediaAcertos: 0.7 },
                { provaId: 2, provaNome: 'Simulado SQL', acertos: 5, erros: 5, mediaAcertos: 0.5 }
            ];
            await new Promise(resolve => setTimeout(resolve, 600)); // Simula carregamento
            setData(mockData);
        } catch (err) {
            setError('Erro ao carregar dados de performance');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        error,
        refresh: fetchData
    };
}
