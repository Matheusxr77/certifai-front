import { useState } from "react";

export interface ItemChecklist {
  id?: number;
  descricao: string;
  concluido?: boolean;
  checklistId?: number;
  conclusao?: string | null;
}

export interface Checklist {
  id: number;
  nome: string;
  descricao: string;
  itensChecklist: ItemChecklist[];
  certificacaoId?: number;
  usuarioId?: number;
}

export interface ChecklistModel {
  checklists: Checklist[];
  isLoading: boolean;
  error: string | null;
  showModal: boolean;
  selectedChecklist: Checklist | null;
  isSidebarExpanded: boolean;
}

// REMOVA os dados mockados da initial state
export const initialChecklistModel: ChecklistModel = {
  checklists: [], // Array vazio - os dados virão do banco
  isLoading: true, // Inicia como true para mostrar loading
  error: null,
  showModal: false,
  selectedChecklist: null,
  isSidebarExpanded: true,
};

export const useChecklistModel = () => {
  const [model, setModel] = useState<ChecklistModel>(initialChecklistModel);

  const updateModel = (updates: Partial<ChecklistModel>) => {
    setModel((prev) => ({ ...prev, ...updates }));
  };

  const getFilteredChecklists = () => {
    return model.checklists; 
  };

  return {
    model,
    updateModel,
    getFilteredChecklists,
  };
};