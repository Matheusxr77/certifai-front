import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { navigationItems } from './indexModel';

import type { NavigationItem } from './indexModel';
import type { SidebarActions } from '../../interfaces/SidebarInterfaces.tsx';
import api from '../../api.tsx';

export const useSidebarController = (): SidebarActions => {
    const navigate = useNavigate();

    const handleLogout = () => {
        api.post('auth/logout')
        .then(() => {
            console.log("Logout bem-sucedido no servidor.");

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            toast.success('Logout realizado com sucesso!');
            
            navigate('/login');
        })
        .catch(error => {
            console.error('Erro ao realizar logout no servidor:', error);
            toast.error('Não foi possível fazer logout. Tente novamente.');
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        });
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