import React, { useState } from 'react';
import { 
    FiPlus, 
    FiEdit3, 
    FiTrash2, 
    FiLoader, 
    FiRefreshCw,
    FiAward,
    FiClock,
    FiBookOpen,
    FiSearch,
    FiFilter
} from 'react-icons/fi';
import { useCertificationsController } from './indexController.tsx';
import { 
    CERTIFICATIONS_CONSTANTS, 
    DIFFICULTY_OPTIONS 
} from './indexModel.tsx';
import Sidebar from '../../components/sidebar';
import CertificationModal from './components/CertificationModal';
import DeleteCertificationModal from './components/DeleteCertificationModal';
import './styles.css';

const CertificationsPage: React.FC = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(true);
    
    const {
        filteredCertifications,
        isLoading,
        error,
        showCreateModal,
        showEditModal,
        showDeleteModal,
        selectedCertification,
        searchTerm,
        difficultyFilter,
        handleCreateCertification,
        handleEditCertification,
        handleDeleteCertification,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        refreshCertifications,
        getDifficultyLabel,
        getDifficultyColor,
        formatTime,
        handleSearchChange,
        handleDifficultyFilterChange
    } = useCertificationsController();

    const toggleSidebar = () => {
        setSidebarExpanded(!isSidebarExpanded);
    };

    if (isLoading) {
        return (
            <div className={`certifications-container ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
                <Sidebar 
                    isExpanded={isSidebarExpanded} 
                    toggleSidebar={toggleSidebar} 
                />
                <main className="main-content">
                    <div className="certifications-loading">
                        <FiLoader className="loading-icon spinning" />
                        <p>{CERTIFICATIONS_CONSTANTS.LOADING_MESSAGE}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`certifications-container ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}>
            <Sidebar 
                isExpanded={isSidebarExpanded} 
                toggleSidebar={toggleSidebar} 
            />
            <main className="main-content">
                <div className="certifications-wrapper">
                    <div className="certifications-header">
                        <div className="header-content">
                            <h1 className="certifications-title">
                                <FiAward className="title-icon" />
                                {CERTIFICATIONS_CONSTANTS.PAGE_TITLE}
                            </h1>
                        </div>
                        <div className="header-actions">
                            <button 
                                onClick={refreshCertifications} 
                                className="refresh-button"
                                disabled={isLoading}
                            >
                                <FiRefreshCw className={isLoading ? 'spinning' : ''} />
                            </button>
                            <button 
                                onClick={openCreateModal}
                                className="create-button"
                            >
                                <FiPlus />
                                {CERTIFICATIONS_CONSTANTS.CREATE_BUTTON_TEXT}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="certifications-list-container">
                        <div className="filters-section">
                            <div className="search-container">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder={CERTIFICATIONS_CONSTANTS.SEARCH_PLACEHOLDER}
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <div className="filter-container">
                                <FiFilter className="filter-icon" />
                                <select
                                    value={difficultyFilter}
                                    onChange={(e) => handleDifficultyFilterChange(e.target.value as "" | typeof DIFFICULTY_OPTIONS[number]['value'])}
                                    className="filter-select"
                                >
                                    <option value="">{CERTIFICATIONS_CONSTANTS.ALL_DIFFICULTIES}</option>
                                    {DIFFICULTY_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="certifications-list-header">
                            <h2 className="certifications-list-title">{CERTIFICATIONS_CONSTANTS.CERTIFICATIONS_LIST_TITLE}</h2>
                            <span className="certifications-count">
                                {filteredCertifications.length === 0 ? (
                                    <span>{CERTIFICATIONS_CONSTANTS.EMPTY_STATE_TITLE}</span>
                                ) : filteredCertifications.length === 1 ? (
                                    <span>{CERTIFICATIONS_CONSTANTS.EMPTY_STATE_ONE_CERTIFICATION}</span>
                                ) : (
                                    <span>{filteredCertifications.length} {CERTIFICATIONS_CONSTANTS.EMPTY_STATE_MULTIPLE_CERTIFICATIONS}</span>
                                )}
                            </span>
                        </div>

                        <div className="certifications-list-content">
                            {filteredCertifications.length === 0 ? (
                                <div className="empty-state">
                                    <FiAward className="empty-icon" />
                                    <h3>{CERTIFICATIONS_CONSTANTS.EMPTY_STATE_TITLE}</h3>
                                    <p>{CERTIFICATIONS_CONSTANTS.EMPTY_STATE_SUBTITLE}</p>
                                    <button 
                                        onClick={openCreateModal}
                                        className="empty-create-button"
                                    >
                                        <FiPlus />
                                        {CERTIFICATIONS_CONSTANTS.CREATE_BUTTON_TEXT}
                                    </button>
                                </div>
                            ) : (
                                <div className="certifications-grid">
                                    {filteredCertifications.map((certification) => (
                                        <div key={certification.id} className="certification-card">
                                            <div className="certification-card-header">
                                                <div className="certification-card-title-section">
                                                    <h3 className="certification-card-title">{certification.nome}</h3>
                                                </div>
                                                <div className="difficulty-badge"
                                                    style={{ 
                                                        backgroundColor: `${getDifficultyColor(certification.dificuldade)}20`,
                                                        color: getDifficultyColor(certification.dificuldade),
                                                        border: `1px solid ${getDifficultyColor(certification.dificuldade)}40`
                                                    }}
                                                >
                                                    {getDifficultyLabel(certification.dificuldade)}
                                                </div>
                                            </div>

                                            <div className="card-content">
                                                {certification.descricao && (
                                                    <div className="description-section">
                                                        <FiBookOpen className="section-icon" />
                                                        <p className="description">{certification.descricao}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="card-footer">
                                                <div className="info-item">
                                                    <FiClock className="info-icon" />
                                                    <span className="info-label">{CERTIFICATIONS_CONSTANTS.TIME_LABEL_EXIBITION}</span>
                                                    <span className="info-value">{formatTime(certification.tempo)}</span>
                                                </div>
                                                <div className="card-actions-footer">
                                                    <button 
                                                        onClick={() => openEditModal(certification)}
                                                        className="edit-button"
                                                        title={CERTIFICATIONS_CONSTANTS.EDIT_BUTTON_TEXT}
                                                    >
                                                        <FiEdit3 />
                                                    </button>
                                                    <button 
                                                        onClick={() => openDeleteModal(certification)}
                                                        className="certification-delete-button"
                                                        title={CERTIFICATIONS_CONSTANTS.DELETE_BUTTON_TEXT}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {(showCreateModal || showEditModal) && (
                    <CertificationModal
                        isOpen={showCreateModal || showEditModal}
                        isEdit={showEditModal}
                        certification={selectedCertification}
                        onSave={showEditModal ? 
                            (data) => handleEditCertification(selectedCertification!.id, data) : 
                            handleCreateCertification
                        }
                        onClose={closeModals}
                    />
                )}

                {showDeleteModal && selectedCertification && (
                    <DeleteCertificationModal
                        isOpen={showDeleteModal}
                        certification={selectedCertification}
                        onDelete={() => handleDeleteCertification(selectedCertification.id)}
                        onClose={closeModals}
                    />
                )}
            </main>
        </div>
    );
};

export default CertificationsPage;