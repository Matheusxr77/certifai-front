import type { NavigationItem } from '../components/sidebar/indexModel';

// Interface para props do componente Sidebar
export interface SidebarProps {
    isExpanded: boolean;
    toggleSidebar: () => void;
}

// Interface para estado do sidebar
export interface SidebarState {
    isExpanded: boolean;
    navigationItems: NavigationItem[];
    isLoading: boolean;
    error: string | null;
}

// Interface para ações do sidebar
export interface SidebarActions {
    handleLogout: () => void;
    handleLinkClick: (toggleSidebar: () => void) => void;
    validateNavigationItem: (item: NavigationItem) => boolean;
    getNavigationItemById: (itemId: string) => NavigationItem | undefined;
    getActiveNavigationItems: () => NavigationItem[];
}