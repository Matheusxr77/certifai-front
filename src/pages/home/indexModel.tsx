// Interface para card do dashboard
export interface DashboardCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    path?: string;
    isActive?: boolean;
    requiredRole?: string;
}

// Configuração dos cards do dashboard
export const dashboardCardsConfig: DashboardCard[] = [
    {
        id: 'certificacoes',
        title: 'Certificações',
        description: 'Acesse suas certificações e conquistas.',
        icon: 'FiAward',
        path: '/certifications'
    },
    {
        id: 'banco-questoes',
        title: 'Banco de Questões',
        description: 'Acesse milhares de questões organizadas por disciplina e nível.',
        icon: 'FiBook',
        path: '/questions'
    },
    {
        id: 'simulacao-provas',
        title: 'Provas',
        description: 'Gerencie e pratique com simulados baseados em provas reais.',
        icon: 'FiEdit3',
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
        id: 'gerenciamento-usuarios',
        title: 'Gerenciamento de Usuários',
        description: 'Gerencie usuários, permissões e configurações do sistema.',
        icon: 'FaUsers',
        path: '/management',
        requiredRole: 'ADMIN'
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