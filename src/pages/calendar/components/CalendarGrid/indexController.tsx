import { useState } from "react";
import type { Activity } from "../../indexModel";

export const useCalendarGridController = (activities: Activity[]) => {
  const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getActivitiesByDay = (day: number): Activity[] => {
    return activities.filter((activity) => {
      if (!activity.inicio) return false;

      const rawDate =
        typeof activity.inicio === "string"
          ? activity.inicio
          : String(activity.inicio);

      const normalizedDate = rawDate.includes("T")
        ? rawDate
        : rawDate + "T00:00:00";

      const activityDate = new Date(normalizedDate);

      return (
        activityDate.getDate() === day &&
        activityDate.getMonth() === currentMonth &&
        activityDate.getFullYear() === currentYear
      );
    });
  };

  const goToMonth = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return {
    daysOfWeek,
    currentMonth,
    currentYear,
    getActivitiesByDay,
    goToMonth,
  };
};
