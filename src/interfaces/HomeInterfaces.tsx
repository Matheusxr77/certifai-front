import type { ReactElement } from 'react';
import type { DashboardCard } from '../pages/home/indexModel';

// Interfaces para a página Home
export interface HomeState {
    isSidebarExpanded: boolean;
    dashboardCards: DashboardCard[];
    isLoading: boolean;
    error: string | null;
}

export interface HomeActions {
    toggleSidebar: () => void;
    navigateToCard: (cardId: string) => void;
    refreshDashboard: () => void;
    getIcon: (iconName: string) => ReactElement;
}

export interface HomeControllerReturn extends HomeState, HomeActions {}

// Tipos para validação
export type DashboardCardValidation = {
    isValid: boolean;
    errors?: string[];
};

export type HomeErrorType = 'NETWORK' | 'VALIDATION' | 'UNKNOWN';

export interface HomeError {
    type: HomeErrorType;
    message: string;
    details?: string;
}