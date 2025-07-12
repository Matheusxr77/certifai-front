import './styles.css';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useSidebarController } from './indexController';
import { sidebarIcons } from './indexModel';

import type { SidebarProps } from '../../interfaces/SidebarInterfaces.tsx';

const Sidebar = ({ isExpanded, toggleSidebar }: SidebarProps) => {
    const { 
        handleLogout, 
        handleLinkClick,
        filteredNavigationItems
    } = useSidebarController();

    return (
        <>
            <div 
                className={`sidebar-overlay ${isExpanded && window.innerWidth < 900 ? 'active' : ''}`} 
                onClick={toggleSidebar}
            ></div>
            
            <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Certif<span>AI</span></h2>
                    
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar}
                        data-tooltip-id="toggle-sidebar-tooltip"
                        data-tooltip-content={isExpanded ? 'Recuar' : 'Expandir'}
                        data-tooltip-place="right"
                    >
                        <Tooltip id="toggle-sidebar-tooltip" />
                        {isExpanded ? sidebarIcons.chevronLeft : sidebarIcons.chevronRight}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {filteredNavigationItems.map((item) => (
                            <li key={item.id}>
                                <NavLink 
                                    to={item.path} 
                                    onClick={() => handleLinkClick(toggleSidebar)} 
                                    end={item.id === 'dashboard'}
                                    data-tooltip-id={item.tooltipId}
                                    data-tooltip-content={!isExpanded ? item.label : null}
                                    data-tooltip-place="right"
                                >
                                    <Tooltip id={item.tooltipId} />
                                    {item.icon}
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button"
                        data-tooltip-id="logout-tooltip"
                        data-tooltip-content={!isExpanded ? 'Sair' : null}
                        data-tooltip-place="right">
                        <Tooltip id="logout-tooltip" />
                        {sidebarIcons.logout}
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;