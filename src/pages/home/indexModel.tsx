// Interface para card do dashboard
export interface DashboardCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    path?: string;
    isActive?: boolean;
}

// Configuração dos cards do dashboard
export const dashboardCardsConfig: DashboardCard[] = [
    {
        id: 'banco-questoes',
        title: 'Banco de Questões',
        description: 'Acesse milhares de questões organizadas por disciplina e nível.',
        icon: 'FiBook',
        // path: '/banco-questoes'
        path: '/under-construction'
    },
    {
        id: 'simulacao-provas',
        title: 'Simulação de Provas',
        description: 'Pratique com simulados baseados em provas reais.',
        icon: 'FiEdit3',
        // path: '/simulacao-provas'
        path: '/under-construction'
    },
    {
        id: 'relatorio-desempenho',
        title: 'Relatório de Desempenho',
        description: 'Acompanhe seu progresso e identifique pontos de melhoria.',
        icon: 'FiBarChart3',
        // path: '/relatorio-desempenho'
        path: '/under-construction'
    },
    {
        id: 'checklist-preparacao',
        title: 'Checklist de Preparação',
        description: 'Organize seus estudos com listas de tarefas personalizadas.',
        icon: 'FiCheckSquare',
        // path: '/checklist-preparacao'
        path: '/under-construction'
    },
    {
        id: 'calendario-estudos',
        title: 'Calendário de Estudos',
        description: 'Planeje e acompanhe sua rotina de estudos.',
        icon: 'FiCalendar',
        // path: '/calendario-estudos'
        path: '/under-construction'
    },
    {
        id: 'profile',
        title: 'Perfil',
        description: 'Gerencie suas informações e preferências de conta.',
        icon: 'FiUser',
        path: '/profile',
    }
];

// Constantes da aplicação
export const HOME_CONSTANTS = {
    REFRESH_DELAY: 1000,
    ERROR_TIMEOUT: 5000,
    MOBILE_BREAKPOINT: 900,
    ANIMATION_DURATION: 300
};

// Mensagens de erro
export const HOME_ERROR_MESSAGES = {
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    VALIDATION: 'Dados inválidos fornecidos.',
    UNKNOWN: 'Erro desconhecido. Tente novamente.',
    REFRESH_FAILED: 'Erro ao atualizar o dashboard',
    NAVIGATION_FAILED: 'Erro ao navegar para a página'
};