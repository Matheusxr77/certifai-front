export type ActivityType = 'Estudo' | 'Simulado' | 'Revisão';

export interface Activity {
  id: number;
  titulo: string;
  //time: string;
  //location: string;
  inicio: string;
  fim: string;
  descricao: string;
  //discipline: string;
  type: ActivityType;
}

export interface CalendarFilters {
  searchValue: string;
  discipline: string;
  type: ActivityType | '';
}


