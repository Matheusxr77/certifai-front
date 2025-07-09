import type { NavigationItem } from '../components/sidebar/indexModel';

// Interface para props do componente Sidebar
export interface SidebarProps {
    isExpanded: boolean;
    toggleSidebar: () => void;
}

// Interface para ações do sidebar
export interface SidebarActions {
    handleLogout: () => void;
    handleLinkClick: (toggleSidebar: () => void) => void;
    validateNavigationItem: (item: NavigationItem) => boolean;
    getNavigationItemById: (itemId: string) => NavigationItem | undefined;
    getActiveNavigationItems: () => NavigationItem[];
}