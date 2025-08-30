import React, { useState } from "react";
import { useCalendarHeaderController } from "./indexController";
import "./styles.css";
import type { ActivityType, CalendarFilters } from "./indexModel";
import NewEventModal from "../NewEventModal";
import api from "../../../../api";
import type { AbstractResponse } from "../../../../interfaces/AbstractInterfaces";
import type { NewEventFormData } from "../NewEventModal/indexModel";
import type { Activity } from "../../indexModel";

interface CalendarHeaderProps {
  filters: CalendarFilters;
  setFilters: React.Dispatch<React.SetStateAction<CalendarFilters>>;
  onActivityCreated?: (event: Activity) => void;
  onOpenCreateModal: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  filters,
  setFilters,
  onActivityCreated,
  onOpenCreateModal,
}) => {
  // Use the props instead of the controller hook
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchValue: e.target.value });
  };

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, discipline: e.target.value });
  };

  function isActivityType(value: string): value is ActivityType {
    return value === "Estudo" || value === "Simulado" || value === "Revisão";
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const type: ActivityType | "" = isActivityType(value) ? value : "";

    setFilters({ ...filters, type });
  };

  //const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewActivity = async (data: any) => {
    console.log("Nova atividade:", data);

    try {
      console.log("Nova atividade:", data);

      const startDateTime = `${data.startDate}T12:00:00`;
      const endDateTime = `${data.endDate}T23:59:59`;

      const activityData = {
        titulo: data.title,
        descricao: data.description,
        inicio: startDateTime,
        fim: endDateTime,
        //courseId: data.course,
        //type: data.type
      };

      const response = await api.post<AbstractResponse<Activity>>(
        "/eventos",
        activityData
      );

      console.log(response.data);

      if (response.status >= 200 && response.status < 300) {
        console.log("Atividade criada com sucesso:", response.data);
        // setIsModalOpen(false);

        if (onActivityCreated) {
          onActivityCreated(response.data.data);
        }
      } else {
        throw new Error(response.data.message || "Erro ao criar atividade");
      }
    } catch (error: any) {
      console.error("Erro ao criar atividade:", error);
      alert(`Erro: ${error.message || "Erro ao salvar atividade"}`);
    }
  };

  return (
    // Use class names directly instead of styles.className
    <div className="headerContainer">
      <h1 className="title">Calendário de Estudos</h1>
      <div className="filters">
        {/* <input
          type="text"
          placeholder="Buscar por atividades..."
          value={filters.searchValue}
          onChange={handleSearchChange}
          className="input"
        />
        <select
          value={filters.discipline}
          onChange={handleDisciplineChange}
          className="select"
        >
          <option value="">Filtrar por disciplina</option>
          <option value="Matemática">Matemática</option>
          <option value="História">História</option>
        </select>
        <select
          value={filters.type}
          onChange={handleTypeChange}
          className="select"
        >
          <option value="">Filtrar por tipo de atividade</option>
          <option value="Estudo">Estudo</option>
          <option value="Simulado">Simulado</option>
          <option value="Revisão">Revisão</option>
        </select> */}
        {/* <NewEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewActivity}
        /> */}

        <button onClick={onOpenCreateModal} className="button">
          + NOVA ATIVIDADE
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
