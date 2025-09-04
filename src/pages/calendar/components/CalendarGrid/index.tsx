import React from "react";
import { 
  FiEdit3, 
  FiTrash2 
} from "react-icons/fi";
import { useCalendarGridController } from "./indexController";
import type { Event } from "../../indexModel";
import "./styles.css";

interface CalendarGridProps {
  events: Event[];
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  events,
  currentMonth,
  currentYear,
  onMonthChange,
  onEditEvent,
  onDeleteEvent,
}) => {
  const {
    daysOfWeek,
    calendarDays,
    handlePrevMonth,
    handleNextMonth,
    today,
  } = useCalendarGridController(events, currentMonth, currentYear, onMonthChange);

  return (
    <div className="calendar-grid">
      <div className="calendar-grid-header">
        <button className="calendar-grid-nav" onClick={handlePrevMonth}>◀</button>
        <h2 className="calendar-grid-title">
          {new Date(currentYear, currentMonth).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="calendar-grid-nav" onClick={handleNextMonth}>▶</button>
      </div>
      <div className="calendar-grid-weekdays">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-grid-weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-grid-days">
        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="calendar-grid-day empty"></div>;
          }
          const dayEvents = events.filter((event) => {
            const endDate = new Date(event.fim);
            return (
              endDate.getDate() === day &&
              endDate.getMonth() === currentMonth &&
              endDate.getFullYear() === currentYear
            );
          });
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
          return (
            <div
              key={day}
              className={`calendar-grid-day${isToday ? " today" : ""}`}
            >
              <span className="calendar-grid-date">{day}</span>
              {dayEvents.map((event) => (
                <div key={event.id} className="calendar-grid-event-card">
                  <strong>{event.titulo}</strong>
                  <div className="calendar-grid-actions">
                    <button
                      className="calendar-grid-edit-button"
                      onClick={() => onEditEvent(event)}
                      title="Editar"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      className="calendar-grid-delete-button"
                      onClick={() => onDeleteEvent(event)}
                      title="Excluir"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;