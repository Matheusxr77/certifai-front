import { 
    useState, 
    useEffect 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiCalendar,
    FiBook,
    FiEdit3,
    FiBarChart,
    FiCheckSquare,
    FiUser
} from 'react-icons/fi';
import { 
    dashboardCardsConfig, 
    HOME_CONSTANTS,
    HOME_ERROR_MESSAGES 
} from './indexModel';

import type { 
    HomeControllerReturn, 
    DashboardCardValidation,
    HomeErrorType
} from '../../interfaces/HomeInterfaces.tsx';
import type { DashboardCard } from './indexModel';
import type { ReactElement } from 'react';
import { useAuth } from '../../contexts/authContext.tsx';

export const useHomeController = (): HomeControllerReturn => {    
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);
    const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>(dashboardCardsConfig);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    
    // Função para obter ícones
    const getIcon = (iconName: string): ReactElement => {
        const iconMap: { [key: string]: ReactElement } = {
            'FiCalendar': <FiCalendar className="card-icon" />,
            'FiBook': <FiBook className="card-icon" />,
            'FiEdit3': <FiEdit3 className="card-icon" />,
            'FiBarChart': <FiBarChart className="card-icon" />,
            'FiCheckSquare': <FiCheckSquare className="card-icon" />,
            'FiUser': <FiUser className="card-icon" />
        };
        return iconMap[iconName] || <FiCalendar className="card-icon" />;
    };

    // Validações e utilidades
    const validateDashboardCard = (card: DashboardCard): DashboardCardValidation => {
        const errors: string[] = [];
        
        if (!card.id) errors.push('ID é obrigatório');
        if (!card.title) errors.push('Título é obrigatório');
        if (!card.description) errors.push('Descrição é obrigatória');
        if (!card.icon) errors.push('Ícone é obrigatório');
        
        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    };

    const getCardById = (cardId: string): DashboardCard | undefined => {
        return dashboardCardsConfig.find(card => card.id === cardId);
    };

    const getActiveCards = (): DashboardCard[] => {
        return dashboardCardsConfig.filter(card => card.isActive !== false);
    };

    // Função para criar erro tipado
    const createError = (type: HomeErrorType, customMessage?: string): string => {
        const baseMessage = HOME_ERROR_MESSAGES[type] || HOME_ERROR_MESSAGES.UNKNOWN;
        return customMessage || baseMessage;
    };

    // Ações principais
    const toggleSidebar = () => {
        setSidebarExpanded(!isSidebarExpanded);
    };

    const navigateToCard = (cardId: string) => {
        try {
            const card = getCardById(cardId);
            if (card && card.path) {
                navigate(card.path);
            } else {
                setError(createError('VALIDATION', 'Card não encontrado ou sem rota definida'));
            }
        } catch (err) {
            setError(createError('UNKNOWN', HOME_ERROR_MESSAGES.NAVIGATION_FAILED));
        }
    };

    const refreshDashboard = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Simula uma chamada à API para atualizar os dados do dashboard
            await new Promise(resolve => setTimeout(resolve, HOME_CONSTANTS.REFRESH_DELAY));
            
            // Validar todos os cards antes de atualizar
            const validCards = dashboardCardsConfig.filter(card => {
                const validation = validateDashboardCard(card);
                return validation.isValid;
            });
            
            setDashboardCards(validCards);
        } catch (err) {
            const errorMessage = createError('NETWORK', HOME_ERROR_MESSAGES.REFRESH_FAILED);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Efeito para limpar erro automaticamente
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, HOME_CONSTANTS.ERROR_TIMEOUT);
            
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Efeito para inicializar dados
    useEffect(() => {
        // Aqui você pode fazer chamadas iniciais para carregar dados
        const activeCards = getActiveCards();
        setDashboardCards(activeCards);
    }, []);

    return {
        isSidebarExpanded,
        dashboardCards,
        isLoading,
        error,
        toggleSidebar,
        navigateToCard,
        refreshDashboard,
        getIcon
    };
};