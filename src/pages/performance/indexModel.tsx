export interface PerformanceItem {
    provaId: number;
    provaNome: string;
    acertos: number;
    erros: number;
    mediaAcertos?: number; // Adicionado campo opcional
}

export interface PerformanceControllerHook {
    data: PerformanceItem[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}
