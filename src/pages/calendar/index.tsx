import React from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";
import Sidebar from "../../components/sidebar";
import EventModal from "./components/EventModal";
import DeleteEventModal from "./components/DeleteEventModal";
import CalendarGrid from "./components/CalendarGrid";
import { useCalendarPageController } from "./indexController";
import "./styles.css";

const StudyCalendarPage: React.FC = () => {
  const {
    events,
    loading,
    error,
    isSidebarExpanded,
    toggleSidebar,
    handleRefresh,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedEvent,
    setSelectedEvent,
    handleDeleteEvent,
    handleOpenEditModal,
    handleOpenDeleteModal,
    currentMonth,
    currentYear,
    handleMonthChange,
    fetchEvents,
  } = useCalendarPageController();

  return (
    <div
      className={`event-page-container${!isSidebarExpanded ? " sidebar-collapsed" : ""
        }`}
    >
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      <main className="event-main-content">
        <div className="event-header">
          <h1 className="event-title">
            <span className="event-title-icon">
              <FiCalendar />
            </span>
            Calendário de Estudos
          </h1>
          <div className="event-header-actions">
            <button
              className="event-refresh-button"
              onClick={handleRefresh}
              disabled={loading}
              title="Atualizar"
            >
              <FiRefreshCw className={loading ? "spinning" : ""} />
            </button>
            <button
              className="event-create-button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Nova Atividade
            </button>
          </div>
        </div>
        {loading && <p>Carregando eventos...</p>}
        {error && <p className="event-error-message">Erro: {error}</p>}
        <div className="event-calendar">
          <CalendarGrid
            events={events}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
            onEditEvent={handleOpenEditModal}
            onDeleteEvent={handleOpenDeleteModal}
          />
        </div>
        <EventModal
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          onSubmit={async () => Promise.resolve()}
          event={selectedEvent}
          isEditMode={isEditModalOpen}
          fetchEvents={fetchEvents}
        />
        <DeleteEventModal
          isOpen={isDeleteModalOpen}
          event={selectedEvent}
          onDelete={async () => {
            await handleDeleteEvent();
            setIsDeleteModalOpen(false);
            setSelectedEvent(null);
            await fetchEvents();
          }}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedEvent(null);
          }}
          fetchEvents={fetchEvents}
        />
      </main>
    </div>
  );
};

export default StudyCalendarPage;