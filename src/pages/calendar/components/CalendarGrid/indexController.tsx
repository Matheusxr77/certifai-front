import { useMemo } from "react";
import type { Event } from "../../indexModel";

export const useCalendarGridController = (
  events: Event[],
  currentMonth: number,
  currentYear: number,
  onMonthChange: (month: number, year: number) => void
) => {
  const today = useMemo(() => new Date(), []);
  const daysOfWeek = useMemo(
    () => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    []
  );

  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentMonth, currentYear]
  );

  const firstDayIndex = useMemo(
    () => new Date(currentYear, currentMonth, 1).getDay(),
    [currentMonth, currentYear]
  );

  const calendarDays = useMemo(() => {
    return Array.from(
      { length: firstDayIndex + daysInMonth },
      (_, i) => (i < firstDayIndex ? null : i - firstDayIndex + 1)
    );
  }, [firstDayIndex, daysInMonth]);

  const getEventsByDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.inicio);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const handlePrevMonth = () => {
    let month = currentMonth - 1;
    let year = currentYear;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    onMonthChange(month, year);
  };

  const handleNextMonth = () => {
    let month = currentMonth + 1;
    let year = currentYear;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    onMonthChange(month, year);
  };

  return {
    today,
    daysOfWeek,
    calendarDays,
    getEventsByDay,
    handlePrevMonth,
    handleNextMonth,
  };
};