import type { Event } from "../../indexModel";

export interface CalendarGridProps {
  events: Event[];
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}