import React, { useState } from "react";
import {
  FiClipboard,
  FiRefreshCw,
  FiPlus,
  FiLoader,
  FiTrash2,
  FiCheckSquare,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Sidebar from "../../components/sidebar";
import { useChecklistController } from "./indexController";
import ChecklistModal from "./components/ChecklistModal";
import type { Checklist } from "./indexModel";
import "./styles.css";

const ChecklistPage: React.FC = () => {
  const {
    filteredChecklists,
    isLoading,
    error,
    refreshChecklists,
    isSidebarExpanded,
    toggleSidebar,
    handleCreateChecklist,
    handleUpdateChecklist,
    handleToggleItem,
    handleDeleteChecklist,
    
  } = useChecklistController();

console.log("Checklists:", filteredChecklists);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create"
  );
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(
    null
  );

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedChecklist(null);
    setIsModalOpen(true);
  };

  const openViewModal = (checklist: Checklist) => {
    setModalMode("view");
    setSelectedChecklist(checklist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  

  const getConcluidosCount = (itensChecklist: any[]) =>
    itensChecklist.filter((item) => item.concluido).length;

  // Aplica busca e filtro
  const visibleChecklists = filteredChecklists.filter((checklist) => {
    const concluidos = getConcluidosCount(checklist.itensChecklist);
    const pendentes = checklist.itensChecklist.length - concluidos;

    const matchesSearch = checklist.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "todos" ||
      (filterStatus === "concluidos" && pendentes === 0) ||
      (filterStatus === "pendentes" && pendentes > 0);

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div
        className={`checklist-container${
          !isSidebarExpanded ? " sidebar-collapsed" : ""
        }`}
      >
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <div className="checklist-loading">
            <FiLoader className="loading-icon spinning" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`checklist-container${
        !isSidebarExpanded ? " sidebar-collapsed" : ""
      }`}
    >
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <main className="main-content">
        <div className="checklist-wrapper">
          {/* Header principal */}
          <div className="checklist-header">
            <h1 className="checklist-title">
              <FiCheckSquare className="title-icon" /> Checklists
            </h1>
            <div className="header-actions">
              <button
                onClick={refreshChecklists}
                className="refresh-button"
                title="Atualizar"
              >
                <FiRefreshCw />
              </button>
              <button className="create-button" onClick={openCreateModal}>
                <FiPlus /> Nova Checklist
              </button>
            </div>
          </div>

          {/* Filtros e busca */}
          <div className="filters-section">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar checklist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-container">
              <FiFilter className="filter-icon" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="todos">Todos</option>
                <option value="concluidos">Concluídos</option>
                <option value="pendentes">Pendentes</option>
              </select>
            </div>
          </div>

          {/* Grid de cards */}
          <div className="checklist-grid-container">
            {error && <p className="error-message">{error}</p>}

            {visibleChecklists.length === 0 ? (
              <div className="empty-state">
                <FiClipboard className="empty-icon" />
                <h3>Nenhuma checklist encontrada</h3>
                <p>Crie sua primeira checklist para começar.</p>
                <button
                  className="empty-create-button"
                  onClick={openCreateModal}
                >
                  <FiPlus /> Criar Checklist
                </button>
              </div>
            ) : (
              <div className="checklist-grid">
                {visibleChecklists.map((checklist) => {
                  const concluidos = getConcluidosCount(checklist.itensChecklist);
                  const pendentes = checklist.itensChecklist.length - concluidos;
                  const progresso =
                    checklist.itensChecklist.length > 0
                      ? (concluidos / checklist.itensChecklist.length) * 100
                      : 0;

                  return (
                    <div
                      key={checklist.id}
                      className="checklist-card"
                      onClick={() => openViewModal(checklist)}
                    >
                      <h3 className="card-title">{checklist.nome}</h3>

                      {/* Barra de progresso */}
                      <div className="progress-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${progresso}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        {Math.round(progresso)}% concluído
                      </div>

                      <p className="card-info">
                        <FiCheckCircle />
                        Concluídos: <strong>{concluidos}</strong>
                      </p>
                      <p className="card-info">
                        <FiClock />
                        Pendentes: <strong>{pendentes}</strong>
                      </p>
                      <div className="card-actions">
                        <button
                          className="delete-button"
                          title="Excluir"
                          onClick={(e) =>
                            handleDeleteChecklist(checklist.id, e)
                          }
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <ChecklistModal
          mode={modalMode}
          checklist={selectedChecklist}
          onClose={closeModal}
          onCreate={handleCreateChecklist}
          onUpdate={handleUpdateChecklist}
          onToggleItem={handleToggleItem}
        />
      )}
    </div>
  );
};

export default ChecklistPage;
