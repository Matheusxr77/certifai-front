export type ActivityType = 'Estudo' | 'Simulado' | 'Revisão';

export interface CalendarFilters {
  searchValue: string;
  discipline: string;
  type: ActivityType | '';
}