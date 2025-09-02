import { 
  useState, 
  useEffect, 
  useCallback 
} from "react";
import api from "../../api";
import type { Event } from "./indexModel";
import type { AbstractResponse } from "../../interfaces/AbstractInterfaces";

export const useCalendarPageController = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<AbstractResponse<Event[]>>("/eventos");
      setEvents(response.data.data || []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    setLoading(true);
    try {
      const response = await api.delete<AbstractResponse<void>>(
        `/eventos/${selectedEvent.id}`
      );
      await fetchEvents();
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setSelectedEvent(null);
      } else {
        throw new Error(response.data.message || "Erro ao excluir evento");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao excluir evento");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return {
    events,
    loading,
    error,
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
    fetchEvents
  };
};