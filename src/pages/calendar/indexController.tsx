import { useEffect, useState, useMemo, useCallback } from "react";
import type { Activity, CalendarFilters } from "./indexModel";
//import { mockActivities } from "./indexModel";
import type { AbstractResponse } from "../../interfaces/AbstractInterfaces";
import api from "../../api";

export const useCalendarPageController = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState<CalendarFilters>({
    searchValue: "",
    discipline: "",
    type: "",
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  console.log("Editing activity:", editingActivity);
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<AbstractResponse<Activity[]>>("/eventos");
      if (!response.data.success) {
        throw new Error("Erro ao buscar eventos");
      }
      setActivities(response.data.data || []);
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  const forceRefresh = useCallback(() => {
    console.log("Manual refresh");
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const updateActivity = useCallback(
    async (activity: Activity) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.put<AbstractResponse<Activity>>(
          `/eventos/${activity.id}`,
          {
            titulo: activity.titulo,
            descricao: activity.descricao,
            inicio: activity.inicio,
            fim: activity.fim,
          }
        );

        console.log(response);

        if (!response.data) {
          throw new Error("Erro ao atualizar evento");
        }

        await fetchActivities();

        return response.data;
      } catch (err: any) {
        await fetchActivities();
        setError(err.message || "Erro inesperado");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchActivities]
  );

  const handleEditActivity = useCallback((activity: Activity) => {
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingActivity(null);
  }, []);

  const handleEditSubmit = useCallback(
    async (formData: any) => {
      console.log("=== DEBUG handleEditSubmit ===");
      console.log("formData recebido:", formData);

      const formatarDataParaBackend = (dataString: string) => {
        if (!dataString) return null;

        try {
          const data = new Date(dataString);

          if (isNaN(data.getTime())) {
            console.error("Data inválida:", dataString);
            return null;
          }

          return data.toISOString();
        } catch (error) {
          console.error("Erro ao formatar data:", error);
          return null;
        }
      };

      const dadosParaBackend = {
        titulo: formData.title,
        descricao: formData.description,
        inicio: formatarDataParaBackend(formData.startDate),
        fim: formatarDataParaBackend(formData.endDate),
      };

      console.log("Dados para backend:", dadosParaBackend);

      try {
        if (editingActivity && editingActivity.id) {
          const dadosCompletos = {
            id: editingActivity.id,
            ...dadosParaBackend,
            type: editingActivity.type,
          } as Activity;

          await updateActivity(dadosCompletos);
          handleCloseEditModal();
        }
      } catch (err) {
        console.error("Erro ao atualizar atividade:", err);
      }
    },
    [editingActivity, updateActivity, handleCloseEditModal]
  );

  const deleteActivity = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.delete<AbstractResponse<void>>(
          `/eventos/${id}`
        );

        console.log(response);

        // if (!response.data) {
        //   throw new Error("Erro ao atualizar evento");
        // }

        await fetchActivities();
        return response.data;
      } catch (err: any) {
        await fetchActivities();
        setError(err.message || "Erro inesperado");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchActivities]
  );

  const handleDeleteActivity = useCallback(
    async (id: number) => {
      if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
        try {
          await deleteActivity(id);
        } catch (err) {
          console.error("Erro ao excluir atividade:", err);
        }
      }
    },
    [deleteActivity]
  );

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (!activity) return false;

      const activityTitle = activity.titulo || "";
      const searchValue = filters?.searchValue || "";

      const matchesSearch = activityTitle
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      // const matchesDiscipline = filters?.discipline
      //   ? activity.discipline === filters.discipline
      //   : true;

      const matchesType = filters?.type ? activity.type === filters.type : true;

      return matchesSearch && matchesType;
    });
  }, [activities, filters]);

  return {
    filters,
    setFilters,
    activities: filteredActivities,
    loading,
    error,
    editingActivity,
    isEditModalOpen,
    handleEditActivity,
    handleCloseEditModal,
    handleEditSubmit,
    handleDeleteActivity,
    fetchActivities,
    forceRefresh,
  };
};
