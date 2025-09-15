// index modal - Corrigido
import React from "react";
import { FiX, FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import type { Checklist } from "../../indexModel";
import { useChecklistModalController } from "./indexController";
import type { ChecklistItem, ChecklistModalMode } from "./indexModel";
import "./styles.css";

interface ChecklistModalProps {
  mode: ChecklistModalMode;
  checklist?: Checklist | null;
  onClose: () => void;
  onCreate: (nome: string, itens: ChecklistItem[], certificacao_id: number, descricao?: string) => void;
  onUpdate: (id: number, nome: string, itens: ChecklistItem[], certificacao_id: number, descricao?: string) => void;
}

const ChecklistModal: React.FC<ChecklistModalProps> = ({
  mode,
  checklist = null,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const {
    model,
    certificacoes,
    updateField,
    setModel,
    updateItem,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
  } = useChecklistModalController(mode, checklist, onCreate, onUpdate, onClose);

  return (
    <div className="modal-checklist-overlay">
      <div className="modal-checklist-container">
        <div className="modal-checklist-header">
          <h2>{mode === "create" ? "Criar Checklist" : "Editar Checklist"}</h2>
          <button className="modal-checklist-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-checklist-form">
          <div className="modal-checklist-form-group full-width">
            <label>Nome da Checklist</label>
            <input
              type="text"
              placeholder="Digite o nome da checklist"
              value={model.nome}
              onChange={(e) => updateField("nome", e.target.value)}
            />
          </div>
          <div className="modal-checklist-form-group full-width">
            <label>Descrição</label>
            <input
              type="text"
              placeholder="Digite uma descrição para a checklist"
              value={model.descricao}
              onChange={e => updateField("descricao", e.target.value)}
            />
          </div>
          <div className="modal-checklist-form-group full-width">
            <label>Certificação</label>
            <select
              value={model.certificacao_id || 0}
              onChange={(e) =>
                setModel((prev) => ({
                  ...prev,
                  certificacao_id: Number(e.target.value),
                }))
              }
            >
              <option value={0}>Selecione</option>
              {certificacoes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-checklist-items">
            <label>Itens</label>

            {model.itensChecklist.map((item, index) => (
              <div key={item.id || index} className="modal-checklist-item">
                <input
                  type="checkbox"
                  checked={item.concluido || false}
                  onChange={(e) =>
                    updateItem(index, { concluido: e.target.checked })
                  }
                  className="item-checkbox"
                />

                <input
                  type="text"
                  placeholder={`Item ${index + 1}`}
                  value={item.descricao}
                  onChange={(e) => updateField("itens", e.target.value, index)}
                  className="item-input"
                />

                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(index)}
                  title="Remover item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-item-btn"
              onClick={handleAddItem}
            >
              <FiPlus /> Adicionar novo item
            </button>
          </div>
        </div>

        <div className="modal-checklist-actions">
          <button className="modal-checklist-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-checklist-save" onClick={handleSubmit}>
            <FiSave />{" "}
            {mode === "create" ? "Criar Checklist" : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;
