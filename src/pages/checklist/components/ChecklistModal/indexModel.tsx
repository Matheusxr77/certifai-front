export interface ChecklistItem {
  id: number;
  descricao: string;
  concluido: boolean;
}

export interface Checklist {
  id: number;
  nome: string;
  itensChecklist: ChecklistItem[]; 
}


export type ChecklistModalMode = "create" | "edit" | "view";

export interface ChecklistModalModel {
  mode: ChecklistModalMode;
  checklist: Checklist | null; 
  certificacaoId: number | null;
  nome: string;
  itensChecklist: ChecklistItem[];
}