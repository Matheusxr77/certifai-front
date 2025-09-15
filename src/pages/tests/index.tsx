import React from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiLoader, FiRefreshCw, FiSearch, FiFilter, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useTestsController } from './indexController';
import { TESTS_CONSTANTS, STATUS_OPTIONS } from './indexModel';
import Sidebar from '../../components/sidebar';
import TestModal from './components/TestModal';
import DeleteTestModal from './components/DeleteTestModal';
import './styles.css';

const TestsPage: React.FC = () => {
    const {
        filteredTests,
        isLoading,
        error,
        showCreateModal,
        showEditModal,
        showDeleteModal,
        selectedTest,
        searchTerm,
        statusFilter,
        handleCreateTest,
        handleEditTest,
        handleDeleteTest,
        openCreateModal,
        openDeleteModal,
        closeModals,
        refreshTests,
        handleSearchChange,
        handleStatusFilterChange,
        certificacoes,
        certificacaoFilter,
        handleCertificacaoFilterChange,
        isSidebarExpanded,
        toggleSidebar,
        handleStartTest
    } = useTestsController();

    if (isLoading) {
        return (
            <div className={`tests-container${!isSidebarExpanded ? ' tests-sidebar-collapsed' : ''}`}>
                <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
                <main className="tests-main-content">
                    <div className="tests-loading">
                        <FiLoader className="tests-loading-icon spinning" />
                        <p>{TESTS_CONSTANTS.LOADING_MESSAGE}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`tests-container${!isSidebarExpanded ? ' tests-sidebar-collapsed' : ''}`}>
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <main className="tests-main-content">
                <div className="tests-wrapper">
                    <div className="tests-header">
                        <div className="tests-header-content">
                            <h1 className="tests-title">
                                <FiEdit3 className="tests-title-icon" />
                                {TESTS_CONSTANTS.PAGE_TITLE}
                            </h1>
                        </div>
                        <div className="tests-header-actions">
                            <button
                                onClick={refreshTests}
                                className="tests-refresh-button"
                                disabled={isLoading}
                            >
                                <FiRefreshCw className={isLoading ? 'spinning' : ''} />
                            </button>
                            <button
                                onClick={openCreateModal}
                                className="tests-create-button"
                            >
                                <FiPlus />
                                {TESTS_CONSTANTS.CREATE_BUTTON_TEXT}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="tests-error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="tests-list-container">
                        <div className="tests-filters-section">
                            <div className="tests-search-container">
                                <FiSearch className="tests-search-icon" />
                                <input
                                    type="text"
                                    placeholder={TESTS_CONSTANTS.SEARCH_PLACEHOLDER}
                                    value={searchTerm}
                                    onChange={e => handleSearchChange(e.target.value)}
                                    className="tests-search-input"
                                />
                            </div>
                            <div className="tests-filter-container">
                                <FiFilter className="tests-filter-icon" />
                                <select
                                    value={statusFilter}
                                    onChange={e => handleStatusFilterChange(e.target.value as any)}
                                    className="tests-filter-select"
                                >
                                    <option value="">{TESTS_CONSTANTS.ALL_STATUS}</option>
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="tests-filter-container">
                                <FiEdit3 className="tests-filter-icon" />
                                <select
                                    value={certificacaoFilter}
                                    onChange={e => handleCertificacaoFilterChange(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="tests-filter-select"
                                >
                                    <option value="">Todas as certificações</option>
                                    {certificacoes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="tests-list-header">
                            <h2 className="tests-list-title">{TESTS_CONSTANTS.TESTS_LIST_TITLE}</h2>
                            <span className="tests-count">
                                {filteredTests.length === 0 ? (
                                    <span>{TESTS_CONSTANTS.EMPTY_STATE_TITLE}</span>
                                ) : filteredTests.length === 1 ? (
                                    <span>{TESTS_CONSTANTS.EMPTY_STATE_ONE_TEST}</span>
                                ) : (
                                    <span>{filteredTests.length} {TESTS_CONSTANTS.EMPTY_STATE_MULTIPLE_TESTS}</span>
                                )}
                            </span>
                        </div>
                        <div className="tests-list-content">
                            {filteredTests.length === 0 ? (
                                <div className="tests-empty-state">
                                    <FiEdit3 className="tests-empty-icon" />
                                    <h3>{TESTS_CONSTANTS.EMPTY_STATE_TITLE}</h3>
                                    <p>{TESTS_CONSTANTS.EMPTY_STATE_SUBTITLE}</p>
                                    <button
                                        onClick={openCreateModal}
                                        className="tests-empty-create-button"
                                    >
                                        <FiPlus />
                                        {TESTS_CONSTANTS.CREATE_BUTTON_TEXT}
                                    </button>
                                </div>
                            ) : (
                                <div className="tests-grid">
                                    {filteredTests.map(test => (
                                        <div key={test.id} className="tests-card">
                                            <div className="tests-card-header">
                                                <div className="tests-card-title-section">
                                                    <h3 className="tests-card-title">{test?.nome ?? 'Sem nome'}</h3>
                                                    <span className="tests-card-difficulty">{test.certificacao?.dificuldade ?? ''}</span>
                                                </div>
                                                <span className={`tests-status-badge tests-status-${test.status?.toLowerCase?.() ?? 'pendente'}`}>
                                                    {STATUS_OPTIONS.find(opt => opt.value === test.status)?.label ?? 'Pendente'}
                                                </span>
                                            </div>
                                            <div className="tests-card-content">
                                                <div className="tests-info-section">
                                                    <div className="tests-info-item">
                                                        <FiClock className="tests-info-icon" />
                                                        <span className="tests-info-label">{TESTS_CONSTANTS.TIME_LABEL}</span>
                                                        <span className="tests-info-value">{test.tempo ?? 0} min</span>
                                                    </div>
                                                    {test.status === 'CONCLUIDA' && (
                                                        <div className="tests-info-item">
                                                            <FiCheckCircle className="tests-info-icon" />
                                                            <span className="tests-info-label">{TESTS_CONSTANTS.SCORE_LABEL}</span>
                                                            <span className="tests-info-value">{test.pontuacao ?? 0}</span>
                                                        </div>
                                                    )}
                                                    <div className="tests-info-item">
                                                        <span className="tests-info-label">{test.comTempo ? TESTS_CONSTANTS.WITH_TIME_LABEL : TESTS_CONSTANTS.WITHOUT_TIME_LABEL}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tests-card-footer">
                                                <button
                                                    className="tests-start-button"
                                                    onClick={() => handleStartTest(test.id)}
                                                    title="Iniciar Prova"
                                                >
                                                    Iniciar Prova
                                                </button>
                                                <div className="tests-card-actions-footer">
                                                    {/* <button
                                                        onClick={() => openEditModal(test)}
                                                        className="tests-edit-button"
                                                        title={TESTS_CONSTANTS.EDIT_BUTTON_TEXT}
                                                    >
                                                        <FiEdit3 />
                                                    </button> */}
                                                    <button
                                                        onClick={() => openDeleteModal(test)}
                                                        className="tests-delete-button"
                                                        title={TESTS_CONSTANTS.DELETE_BUTTON_TEXT}
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
                    <TestModal
                        isOpen={showCreateModal || showEditModal}
                        isEdit={showEditModal}
                        test={selectedTest}
                        certificacoes={certificacoes}
                        onSave={showEditModal ?
                            (data) => handleEditTest(selectedTest!.id, data) :
                            handleCreateTest
                        }
                        onClose={closeModals}
                    />
                )}
                {showDeleteModal && selectedTest && (
                    <DeleteTestModal
                        isOpen={showDeleteModal}
                        test={selectedTest}
                        onDelete={() => handleDeleteTest(selectedTest.id)}
                        onClose={closeModals}
                    />
                )}
            </main>
        </div>
    );
};

export default TestsPage;