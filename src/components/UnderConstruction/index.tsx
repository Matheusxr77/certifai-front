import React from 'react';
import { 
    FiArrowLeft, 
    FiHome 
} from 'react-icons/fi';
import { useUnderConstructionController } from './indexController.tsx';
import './styles.css';

import type { UnderConstructionProps } from './indexModel.tsx';

const UnderConstruction: React.FC<UnderConstructionProps> = (props) => {
    const { state, handleBackClick, handleHomeClick } = useUnderConstructionController(props);

    return (
        <div className="under-construction-container">
            <div className="under-construction-content">
                <div className="hammer-animation">
                    <div className="hammer-container">
                        <div className="hammer">
                            <div className="hammer-head"></div>
                            <div className="hammer-handle"></div>
                        </div>
                    </div>
                </div>

                <div className="text-content">
                    <h1 className="construction-title">{state.title}</h1>
                    <p className="construction-subtitle">{state.subtitle}</p>
                    
                    <div className="progress-indicator">
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                        <span className="progress-text">Construindo...</span>
                    </div>
                </div>

                <div className="navigation-buttons">
                    {state.showBackButton && (
                        <button 
                            className="nav-button back-button"
                            onClick={handleBackClick}
                        >
                            <FiArrowLeft />
                            Voltar
                        </button>
                    )}
                    {state.showHomeButton && (
                        <button 
                            className="nav-button home-button"
                            onClick={handleHomeClick}
                        >
                            <FiHome />
                            Ir para Dashboard
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnderConstruction;