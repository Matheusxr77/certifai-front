import { useState, useCallback } from "react";
import api from "../../../../api";
import type { DeleteEventModalControllerHook, UseDeleteEventModalControllerProps } from "./indexModel";
import type { Event } from "../../indexModel";
import type { AbstractResponse } from "../../../../interfaces/AbstractInterfaces";

export const useDeleteEventModalController = ({
  event,
  onClose,
  fetchEvents,
}: UseDeleteEventModalControllerProps & { event: Event | null; fetchEvents: () => Promise<void> }): DeleteEventModalControllerHook => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!event) return;
    try {
      setIsLoading(true);
      await api.delete<AbstractResponse<void>>(`/eventos/${event.id}`);
      onClose();
      await fetchEvents();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [event, onClose, fetchEvents]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  return {
    isLoading,
    handleDelete,
    handleOverlayClick,
  };
};