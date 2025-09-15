export interface ChecklistItem {
  id: number;
  descricao: string;
  concluido: boolean;
}

export interface Checklist {
  id: number;
  nome: string;
  itensChecklist: ChecklistItem[]; 
  descricao?: string;
}


export type ChecklistModalMode = "create" | "edit" | "view";

export interface ChecklistModalModel {
  mode: ChecklistModalMode;
  checklist: Checklist | null; 
  certificacao_id: number | null;
  nome: string;
  descricao?: string;
  itensChecklist: ChecklistItem[];
}