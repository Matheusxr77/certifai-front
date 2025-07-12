import Sidebar from '../../components/sidebar';
import './styles.css';
import { FiRefreshCw } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { useHomeController } from './indexController';

const Home = () => {
    const { 
        isSidebarExpanded, 
        isLoading, 
        error,
        toggleSidebar, 
        navigateToCard,
        refreshDashboard,
        getIcon,
        filteredDashboardCards
    } = useHomeController();

    return (
        <div className={`home-container ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
            <Sidebar 
                isExpanded={isSidebarExpanded} 
                toggleSidebar={toggleSidebar} 
            />
            
            <main className="main-content">
                <header className="main-content-header">
                    <div className="header-left">
                        <h1>Dashboard</h1>
                    </div>
                    <div className="header-right">
                        <button 
                            className="refresh-button" 
                            onClick={refreshDashboard}
                            disabled={isLoading}
                            data-tooltip-id="refresh-tooltip"
                            data-tooltip-content={isLoading ? 'Atualizando...' : 'Atualizar Dashboard'}
                            data-tooltip-place="bottom"
                        >
                            <Tooltip id="refresh-tooltip" />
                            <FiRefreshCw className={isLoading ? 'spinning' : ''} />
                            {isLoading ? 'Atualizando...' : 'Atualizar'}
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={refreshDashboard}>Tentar novamente</button>
                    </div>
                )}

                <section className="dashboard-cards">
                    {filteredDashboardCards.map(card => (
                        <div 
                            key={card.id} 
                            className="card"
                            onClick={() => navigateToCard(card.id)}
                            data-tooltip-id={`card-${card.id}-tooltip`}
                            data-tooltip-content={`Clique para acessar ${card.title}`}
                            data-tooltip-place="top"
                        >
                            <Tooltip id={`card-${card.id}-tooltip`} />
                            <div className="card-header">
                                {getIcon(card.icon)}
                                <h3>{card.title}</h3>
                            </div>
                            <p>{card.description}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default Home;