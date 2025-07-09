import { 
    FiGrid, 
    FiCalendar,  
    FiLogOut, 
    FiChevronsLeft,
    FiChevronsRight,
    FiBook,
    FiEdit3,
    FiBarChart,
    FiCheckSquare,
    FiUser
} from 'react-icons/fi';
import { 
    FaBoxOpen, 
    FaConciergeBell, 
    FaCut, 
    FaShoppingBag, 
    FaTag, 
    FaUsers 
} from 'react-icons/fa';
import { MdOutlineLoyalty } from 'react-icons/md';
import { BsClockHistory } from 'react-icons/bs';
import type { ReactElement } from 'react';

// Interface para itens de navegação
export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon: ReactElement;
    tooltipId: string;
    isActive?: boolean;
}

// Interface para ícones do sidebar
export interface SidebarIcons {
    chevronLeft: ReactElement;
    chevronRight: ReactElement;
    logout: ReactElement;
    grid: ReactElement;
    calendar: ReactElement;
    cut: ReactElement;
    loyalty: ReactElement;
    users: ReactElement;
    boxOpen: ReactElement;
    clockHistory: ReactElement;
    shoppingBag: ReactElement;
    tag: ReactElement;
    conciergeBell: ReactElement;
    book: ReactElement;
    edit: ReactElement;
    barChart: ReactElement;
    checkSquare: ReactElement;
    user: ReactElement;
}

// Configuração dos ícones do sidebar
export const sidebarIcons: SidebarIcons = {
    chevronLeft: <FiChevronsLeft />,
    chevronRight: <FiChevronsRight />,
    logout: <FiLogOut />,
    grid: <FiGrid />,
    calendar: <FiCalendar />,
    cut: <FaCut />,
    loyalty: <MdOutlineLoyalty />,
    users: <FaUsers />,
    boxOpen: <FaBoxOpen />,
    clockHistory: <BsClockHistory />,
    shoppingBag: <FaShoppingBag />,
    tag: <FaTag />,
    conciergeBell: <FaConciergeBell />,
    book: <FiBook />,
    edit: <FiEdit3 />,
    barChart: <FiBarChart />,
    checkSquare: <FiCheckSquare />,
    user: <FiUser />
};

// Configuração dos itens de navegação
export const navigationItems: NavigationItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: sidebarIcons.grid,
        tooltipId: 'nav-tooltip'
    },
    {
        id: 'banco-questoes',
        label: 'Banco de Questões',
        // path: '/banco-questoes',
        path: '/under-construction',
        icon: sidebarIcons.book,
        tooltipId: 'nav-tooltip'
    },
    {
        id: 'simulacao-provas',
        label: 'Simulação de Provas',
        // path: '/simulacao-provas',
        path: '/under-construction',
        icon: sidebarIcons.edit,
        tooltipId: 'nav-tooltip'
    },
    {
        id: 'relatorio-desempenho',
        label: 'Relatório de Desempenho',
        // path: '/relatorio-desempenho',
        path: '/under-construction',
        icon: sidebarIcons.barChart,
        tooltipId: 'nav-tooltip'
    },
    {
        id: 'checklist-preparacao',
        label: 'Checklist de Preparação',
        // path: '/checklist-preparacao',
        path: '/under-construction',
        icon: sidebarIcons.checkSquare,
        tooltipId: 'nav-tooltip'
    },
    {
        id: 'calendario-estudos',
        label: 'Calendário de Estudos',
        // path: '/calendario-estudos',
        path: '/under-construction',
        icon: sidebarIcons.calendar,
        tooltipId: 'nav-tooltip'
    },
    {
        id: 'profile',
        label: 'Perfil',
        path: '/profile',
        icon: sidebarIcons.user,
        tooltipId: 'nav-tooltip'
    }
];