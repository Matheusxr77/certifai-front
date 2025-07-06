import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { navigationItems } from './indexModel';

import type { NavigationItem } from './indexModel';
import type { SidebarActions } from '../../interfaces/SidebarInterfaces.tsx';

export const useSidebarController = (): SidebarActions => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
        toast.success('Logout realizado com sucesso!');
    };

    const handleLinkClick = (toggleSidebar: () => void) => {
        if (window.innerWidth < 900) {
            toggleSidebar();
        }
    };

    const validateNavigationItem = (item: NavigationItem): boolean => {
        return !!(item.id && item.label && item.path && item.icon && item.tooltipId);
    };

    const getNavigationItemById = (itemId: string): NavigationItem | undefined => {
        return navigationItems.find(item => item.id === itemId);
    };

    const getActiveNavigationItems = (): NavigationItem[] => {
        return navigationItems.filter(item => item.isActive !== false);
    };

    return {
        handleLogout,
        handleLinkClick,
        validateNavigationItem,
        getNavigationItemById,
        getActiveNavigationItems
    };
};