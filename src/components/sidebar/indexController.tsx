import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { toast } from 'react-toastify';
import { navigationItems } from './indexModel';
import { useMemo } from 'react';
import api from '../../api.tsx';

export const useSidebarController = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const filteredNavigationItems = useMemo(() => {
        return navigationItems.filter(item => {
            if (item.requiredRole) {
                return user?.role === item.requiredRole;
            }
            return true;
        });
    }, [user?.role]);

    const handleLogout = () => {
        api.post('auth/logout')
        .then(() => {
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

    return {
        handleLogout,
        handleLinkClick,
        filteredNavigationItems
    };
};