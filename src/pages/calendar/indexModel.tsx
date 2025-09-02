export type EventType = 'Estudo' | 'Simulado' | 'Revisão';

export interface Event {
  id: number;
  titulo: string;
  descricao?: string;
  usuarioId?: number;
  inicio: string;
  fim: string;
  itens?: ItemChecklist[];
}

export interface ItemChecklist {
  id: number;
  nome: string;
  concluido: boolean;
}

export interface EventFormData {
  titulo: string;
  descricao?: string;
  usuarioId?: number;
  inicio: string;
  fim: string;
}