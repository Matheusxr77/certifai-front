import React, { useState, useMemo, useCallback } from "react";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import Sidebar from "../../components/sidebar";
// import WeeklySummary from './components/WeeklySummary';
import NewEventModal from "./components/NewEventModal";
import { useCalendarPageController } from "./indexController";
import "./styles.css";
import type { Activity } from "./indexModel";
import type { AbstractResponse } from "../../interfaces/AbstractInterfaces";
import api from "../../api";

const StudyCalendarPage: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  //const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const {
    activities,
    fetchActivities,
    filters,
    setFilters,
    loading,
    error,
    editingActivity,
    isEditModalOpen,
    handleEditActivity,
    handleCloseEditModal,
    handleEditSubmit,
    handleDeleteActivity,
    forceRefresh
  } = useCalendarPageController();

  // const refreshData = useCallback(() => {
  //   setRefreshKey(prev => prev + 1);
  // }, []);

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  const handleCreateActivity = useCallback(
    async (formData: any) => {
      console.log("Nova atividade:", formData);

      try {
        const startDateTime = `${formData.startDate}T12:00:00`;
        const endDateTime = `${formData.endDate}T23:59:59`;

        const activityData = {
          titulo: formData.title,
          descricao: formData.description,
          inicio: startDateTime,
          fim: endDateTime,
          cursoId: formData.course,
          tipo: formData.type,
        };

        const response = await api.post<AbstractResponse<Activity>>(
          "/eventos",
          activityData
        );

        console.log(response.data);

        if (response.status >= 200 && response.status < 300) {
          console.log("Atividade criada com sucesso:", response.data);
          setIsCreateModalOpen(false);
          forceRefresh();
        } else {
          throw new Error(response.data.message || "Erro ao criar atividade");
        }
      } catch (error: any) {
        console.error("Erro ao criar atividade:", error);
        alert(`Erro: ${error.message || "Erro ao salvar atividade"}`);
        throw error; // Re-lança o erro para ser tratado pelo modal
      }
    },
    [forceRefresh]
  );

  const handleActivityCreated = async (event: Activity) => {
    console.log("Evento criado:", event);
    await fetchActivities();
  };

  const handleActivityUpdated = async (formData: any) => {
    try {
      await handleEditSubmit(formData);
    } catch (err) {
      console.error("Erro ao atualizar atividade:", err);
    }
  };

  const mappedActivities: Activity[] = useMemo(() => {
    if (!activities) return [];
    return activities.map((ev: any) => ({
      id: ev.id,
      titulo: ev.titulo, 
      inicio: ev.inicio, 
      fim: ev.fim,      
      descricao: ev.descricao || "", 
      local: ev.local || "",         
      disciplina: ev.disciplina || "",
      tipo: ev.tipo || "Estudo",      
      cursoId: ev.cursoId || ""      
    }));
  }, [activities]);

  return (
    <div
      className={`page-container ${
        !isSidebarExpanded ? "sidebar-collapsed" : ""
      }`}
    >
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <main className="main-content">
        <CalendarHeader
          filters={filters}
          setFilters={setFilters}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        {loading && <p>Carregando eventos...</p>}
        {error && <p className="error-message">Erro: {error}</p>}

        {!loading && !error && (
          <>
            <CalendarGrid
              activities={mappedActivities}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              currentMonth={currentMonth}
              currentYear={currentYear}
              onMonthChange={handleMonthChange}
            />
          </>
        )}

        {/* Modal para criação */}
        <NewEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateActivity}
          isEditMode={false}
        />

        {/* Modal para edição */}
        <NewEventModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleActivityUpdated}
          activity={editingActivity}
          isEditMode={true}
        />
      </main>
    </div>
  );
};

export default StudyCalendarPage;
