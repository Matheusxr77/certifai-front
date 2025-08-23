import React from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiLoader, FiBookOpen, FiSearch, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { useQuestionsController } from './indexController';
import { QUESTIONS_CONSTANTS, CATEGORIA_OPTIONS, DIFICULDADE_OPTIONS } from './indexModel';
import Sidebar from '../../components/sidebar';
import QuestionModal from './components/QuestionModal/index.tsx';
import DeleteQuestionModal from './components/DeleteQuestionModal/index.tsx';
import './styles.css';

const QuestionsPage: React.FC = () => {
    const {
        filteredQuestoes,
        isLoading,
        error,
        showCreateModal,
        showEditModal,
        showDeleteModal,
        selectedQuestao,
        handleCreateQuestao,
        handleEditQuestao,
        handleDeleteQuestao,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeModals,
        refreshQuestoes,
        searchTerm,
        categoriaFilter,
        dificuldadeFilter,
        handleSearchChange,
        handleCategoriaFilterChange,
        handleDificuldadeFilterChange,
        isSidebarExpanded,
        toggleSidebar
    } = useQuestionsController();

    if (isLoading) {
        return (
            <div className={`questions-container${!isSidebarExpanded ? ' sidebar-collapsed' : ''}`}>
                <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <div className="questions-loading">
                        <FiLoader className="loading-icon spinning" />
                        <p>{QUESTIONS_CONSTANTS.LOADING_MESSAGE}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`questions-container${!isSidebarExpanded ? ' sidebar-collapsed' : ''}`}>
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <main className="main-content">
                <div className="questions-wrapper">
                    <div className="questions-header">
                        <h1 className="questions-title">
                            <FiBookOpen className="title-icon" />
                            {QUESTIONS_CONSTANTS.PAGE_TITLE}
                        </h1>
                        <div className="header-actions">
                            <button 
                                onClick={refreshQuestoes} 
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
                                {QUESTIONS_CONSTANTS.CREATE_BUTTON_TEXT}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="questions-list-container">
                        <div className="filters-section">
                            <div className="search-container">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder={QUESTIONS_CONSTANTS.SEARCH_PLACEHOLDER}
                                    value={searchTerm}
                                    onChange={e => handleSearchChange(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <div className="filter-container">
                                <FiFilter className="filter-icon" />
                                <select
                                    value={categoriaFilter}
                                    onChange={e => handleCategoriaFilterChange(e.target.value as any)}
                                    className="filter-select"
                                >
                                    <option value="">Todas as categorias</option>
                                    {CATEGORIA_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-container">
                                <FiFilter className="filter-icon" />
                                <select
                                    value={dificuldadeFilter}
                                    onChange={e => handleDificuldadeFilterChange(e.target.value as any)}
                                    className="filter-select"
                                >
                                    <option value="">Todas as dificuldades</option>
                                    {DIFICULDADE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="questions-list-header">
                            <h2 className="questions-list-title">{QUESTIONS_CONSTANTS.QUESTIONS_LIST_TITLE}</h2>
                            <span className="questions-count">
                                {filteredQuestoes.length === 0 ? (
                                    <span>{QUESTIONS_CONSTANTS.EMPTY_STATE_TITLE}</span>
                                ) : filteredQuestoes.length === 1 ? (
                                    <span>{QUESTIONS_CONSTANTS.EMPTY_STATE_ONE_QUESTION}</span>
                                ) : (
                                    <span>{filteredQuestoes.length} {QUESTIONS_CONSTANTS.EMPTY_STATE_MULTIPLE_QUESTIONS}</span>
                                )}
                            </span>
                        </div>
                        <div className="questions-list-content">
                            {filteredQuestoes.length === 0 ? (
                                <div className="empty-state">
                                    <FiBookOpen className="empty-icon" />
                                    <h3>{QUESTIONS_CONSTANTS.EMPTY_STATE_TITLE}</h3>
                                    <p>{QUESTIONS_CONSTANTS.EMPTY_STATE_SUBTITLE}</p>
                                    <button 
                                        onClick={openCreateModal}
                                        className="empty-create-button"
                                    >
                                        <FiPlus />
                                        {QUESTIONS_CONSTANTS.CREATE_BUTTON_TEXT}
                                    </button>
                                </div>
                            ) : (
                                <table className="questions-table">
                                    <thead>
                                        <tr>
                                            <th>Enunciado</th>
                                            <th>Categoria</th>
                                            <th>Dificuldade</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredQuestoes.map((questao) => (
                                            <tr key={questao.id}>
                                                <td>{questao.enunciado}</td>
                                                <td>
                                                    <span
                                                        className={`category-badge ${
                                                            questao.categoria === 'NUVEM'
                                                                ? 'nuvem'
                                                                : questao.categoria === 'DEV'
                                                                ? 'dev'
                                                                : questao.categoria === 'BANCO'
                                                                ? 'banco'
                                                                : 'infra'
                                                        }`}
                                                    >
                                                        {questao.categoria === 'NUVEM'
                                                            ? 'Computação em Nuvem'
                                                            : questao.categoria === 'DEV'
                                                            ? 'Desenvolvimento de Software'
                                                            : questao.categoria === 'BANCO'
                                                            ? 'Banco de Dados'
                                                            : 'Infraestrutura'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`difficulty-badge ${
                                                            questao.dificuldade === 'BASICO'
                                                                ? 'basico'
                                                                : questao.dificuldade === 'INTERMEDIARIO'
                                                                ? 'intermediario'
                                                                : 'avancado'
                                                        }`}
                                                    >
                                                        {questao.dificuldade === 'BASICO'
                                                            ? 'Básico'
                                                            : questao.dificuldade === 'INTERMEDIARIO'
                                                            ? 'Intermediário'
                                                            : 'Avançado'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="question-actions">
                                                        <button 
                                                            onClick={() => openEditModal(questao)}
                                                            className="edit-button"
                                                            title={QUESTIONS_CONSTANTS.EDIT_BUTTON_TEXT}
                                                        >
                                                            <FiEdit3 />
                                                        </button>
                                                        <button 
                                                            onClick={() => openDeleteModal(questao)}
                                                            className="delete-button"
                                                            title={QUESTIONS_CONSTANTS.DELETE_BUTTON_TEXT}
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
                {(showCreateModal || showEditModal) && (
                    <QuestionModal
                        isOpen={showCreateModal || showEditModal}
                        isEdit={showEditModal}
                        questao={showEditModal ? selectedQuestao : null}
                        onSave={showEditModal ? 
                            (data) => handleEditQuestao(selectedQuestao!.id, data) : 
                            handleCreateQuestao
                        }
                        onClose={closeModals}
                    />
                )}
                {showDeleteModal && selectedQuestao && (
                    <DeleteQuestionModal
                        isOpen={showDeleteModal}
                        questao={selectedQuestao}
                        onDelete={() => handleDeleteQuestao(selectedQuestao.id)}
                        onClose={closeModals}
                    />
                )}
            </main>
        </div>
    );
};

export default QuestionsPage;