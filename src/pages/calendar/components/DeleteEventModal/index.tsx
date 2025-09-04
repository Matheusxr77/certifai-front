import React from "react";
import { 
  FiX, 
  FiTrash2, 
  FiLoader, 
  FiAlertTriangle 
} from "react-icons/fi";
import { useDeleteEventModalController } from "./indexController";
import "./styles.css";
import type { DeleteEventModalProps } from "./indexModel";

const DeleteEventModal: React.FC<DeleteEventModalProps & { fetchEvents: () => Promise<void> }> = ({
  isOpen,
  event,
  onDelete,
  onClose,
  fetchEvents,
}) => {
  const {
    isLoading,
    handleDelete,
    handleOverlayClick,
  } = useDeleteEventModalController({
    event,
    onDelete,
    onClose,
    fetchEvents,
  });

  if (!isOpen || !event) return null;

  return (
    <div className="modal-delete-event-overlay" onClick={handleOverlayClick}>
      <div className="modal-delete-event-container">
        <div className="modal-delete-event-header">
          <h2 className="modal-delete-event-title">
            <FiTrash2 className="modal-delete-event-title-icon" />
            Excluir Atividade
          </h2>
          <button
            className="modal-delete-event-close-button"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            <FiX />
          </button>
        </div>
        <div className="modal-delete-event-content">
          <div className="modal-delete-event-warning-section">
            <FiAlertTriangle className="modal-delete-event-warning-icon" />
            <div className="modal-delete-event-warning-content">
              <p>
                Tem certeza que deseja excluir a atividade <strong>"{event.titulo}"</strong>?
              </p>
              <p className="modal-delete-event-warning-text">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
          <div className="modal-delete-event-info">
            <div className="modal-delete-event-info-item">
              <span className="modal-delete-event-info-label">Título:</span>
              <span className="modal-delete-event-info-value">{event.titulo}</span>
            </div>
            {event.descricao && (
              <div className="modal-delete-event-info-item">
                <span className="modal-delete-event-info-label">Descrição:</span>
                <span className="modal-delete-event-info-value">{event.descricao}</span>
              </div>
            )}
          </div>
        </div>
        <div className="modal-delete-event-actions">
          <button
            type="button"
            className="modal-delete-event-cancel-button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="modal-delete-event-delete-button"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FiLoader className="spinning" />
                Excluindo...
              </>
            ) : (
              <>
                <FiTrash2 />
                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;