import { 
  useState, 
  useCallback, 
  useEffect 
} from "react";
import api from "../../../../api";
import type { 
  Event, 
  EventFormData 
} from "../../indexModel";
import type { 
  EventModalControllerHook, 
  UseEventModalControllerProps 
} from "./indexModel";
import type { AbstractResponse } from "../../../../interfaces/AbstractInterfaces";

export const useEventModalController = ({
  isOpen,
  isEditMode,
  event,
  onClose,
  fetchEvents
}: UseEventModalControllerProps & { fetchEvents: () => Promise<void> }): EventModalControllerHook => {
  const [formData, setFormData] = useState<EventFormData>({
    titulo: "",
    descricao: "",
    inicio: "",
    fim: "",
    usuarioId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<AbstractResponse<{ id: number }>>("/auth/me");
        setFormData(prev => ({
          ...prev,
          usuarioId: response.data.data?.id
        }));
      } catch {
      }
    };
    if (isOpen) {
      fetchUser();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditMode && event) {
      setFormData({
        titulo: event.titulo || "",
        descricao: event.descricao || "",
        inicio: event.inicio ? event.inicio.split("T")[0] : "",
        fim: event.fim ? event.fim.split("T")[0] : "",
        usuarioId: event.usuarioId,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        titulo: "",
        descricao: "",
        inicio: "",
        fim: "",
      }));
    }
  }, [isEditMode, event, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.titulo || formData.titulo.length < 3) newErrors.titulo = "Título obrigatório";
    if (!formData.inicio) newErrors.inicio = "Data de início obrigatória";
    if (!formData.fim) newErrors.fim = "Data de fim obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsLoading(true);
      try {
        const payload = {
          ...formData,
          inicio: formData.inicio ? new Date(formData.inicio).toISOString() : "",
          fim: formData.fim ? new Date(formData.fim).toISOString() : "",
        };
        if (isEditMode && event) {
          await api.put<AbstractResponse<Event>>(`/eventos/${event.id}`, payload);
        } else {
          await api.post<AbstractResponse<Event>>("/eventos", payload);
        }
        await fetchEvents();
        onClose();
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    },
    [formData, isEditMode, event, onClose, fetchEvents]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  return {
    formData,
    setFormData,
    isLoading,
    errors,
    handleSubmit,
    handleOverlayClick,
    validateForm,
  };
};