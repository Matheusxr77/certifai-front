import React from "react";
import { 
  FiX, 
  FiSave, 
  FiLoader 
} from "react-icons/fi";
import { useEventModalController } from "./indexController";
import "./styles.css";
import type { EventModalProps } from "./indexModel";

const EventModal: React.FC<EventModalProps & { fetchEvents: () => Promise<void> }> = ({
  isOpen,
  onClose,
  onSubmit,
  event,
  isEditMode,
  fetchEvents,
}) => {
  const {
    formData,
    isLoading,
    errors,
    handleSubmit,
    handleOverlayClick,
    setFormData,
  } = useEventModalController({
    isOpen,
    isEditMode: isEditMode ?? false,
    event,
    onSubmit: async (data) => {
      const payload = {
        ...data,
        inicio: data.inicio ? new Date(data.inicio).toISOString() : "",
        fim: data.fim ? new Date(data.fim).toISOString() : "",
      };
      await onSubmit(payload);
    },
    onClose,
    fetchEvents,
  });

  if (!isOpen) return null;

  return (
    <div className="modal-event-overlay" onClick={handleOverlayClick}>
      <div className="modal-event-container">
        <div className="modal-event-header">
          <h2 className="modal-event-title">
            {isEditMode ? "Editar Atividade" : "Nova Atividade"}
          </h2>
          <button
            className="modal-event-close-button"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            <FiX />
          </button>
        </div>
        <form className="modal-event-form" onSubmit={handleSubmit}>
          <div className="modal-event-form-grid">
            <div className="modal-event-form-group">
              <label htmlFor="titulo">Título *</label>
              <input
                type="text"
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, titulo: e.target.value }))}
                required
                disabled={isLoading}
              />
              {errors.titulo && <span className="modal-event-error-text">{errors.titulo}</span>}
            </div>
            <div className="modal-event-form-group">
              <label htmlFor="inicio">Data de Início *</label>
              <input
                type="date"
                id="inicio"
                value={formData.inicio}
                onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, inicio: e.target.value }))}
                required
                disabled={isLoading}
              />
              {errors.inicio && <span className="modal-event-error-text">{errors.inicio}</span>}
            </div>
            <div className="modal-event-form-group">
              <label htmlFor="fim">Data de Fim *</label>
              <input
                type="date"
                id="fim"
                value={formData.fim}
                onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, fim: e.target.value }))}
                required
                disabled={isLoading}
              />
              {errors.fim && <span className="modal-event-error-text">{errors.fim}</span>}
            </div>
            <div className="modal-event-form-group full-width">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, descricao: e.target.value }))}
                disabled={isLoading}
                rows={4}
              />
              {errors.descricao && <span className="modal-event-error-text">{errors.descricao}</span>}
            </div>
          </div>
          <div className="modal-event-actions">
            <button
              type="button"
              className="modal-event-cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-event-save-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FiLoader className="spinning" />
                  {isEditMode ? "Salvando..." : "Criando..."}
                </>
              ) : (
                <>
                  <FiSave />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;