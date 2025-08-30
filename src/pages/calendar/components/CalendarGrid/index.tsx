import React, { useState } from "react";
import { useCalendarGridController } from "./indexController";
import type { Activity, CalendarFilters } from "../../indexModel";
import "./styles.css";
import { toast } from "react-toastify";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

interface Props {
  activities: Activity[];
  filters?: CalendarFilters;
  onEventCreated?: (event: Activity) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}

const CalendarGrid: React.FC<Props> = ({
  activities,
  onEventCreated,
  onEditActivity,
  onDeleteActivity,
}) => {
  console.log("Activities recebidas:", activities);

  const {
    daysOfWeek,
    getActivitiesByDay,
    currentMonth,
    currentYear,
    goToMonth,
  } = useCalendarGridController(activities);

  const [localEvents, setLocalEvents] = useState<Activity[]>([]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = () => {
    if (!form.title || !form.date) {
      toast.error("Preencha ao menos título e data!");
      return;
    }
  
    const newEvent: Activity = {
      id: Date.now(), // id temporário
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      discipline: "",
      type: "Estudo",
      startDate: form.date,
      endDate: form.date,
      description: form.location,
      course: ""
    };
  
    setLocalEvents([...localEvents, newEvent]);
    handleEventCreated(newEvent);
  
    // Corrija esta linha também:
    setForm({ title: "", date: "", time: "", location: "" });
  };

  const handleEventCreated = (event: Activity) => {
    const eventDate = new Date(event.inicio);
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();

    if (eventMonth !== currentMonth || eventYear !== currentYear) {
      toast.info(
        <div>
          Evento criado em{" "}
          {eventDate.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => {
                goToMonth(eventMonth, eventYear);
                toast.dismiss();
              }}
              style={{
                padding: "4px 8px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Ir para o mês
            </button>
          </div>
        </div>,
        { autoClose: false }
      );
    }

    if (onEventCreated) {
      onEventCreated(event);
    }
  };

  const allActivities = [...activities, ...localEvents];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = Array.from(
    { length: firstDayIndex + daysInMonth },
    (_, i) => (i < firstDayIndex ? null : i - firstDayIndex + 1)
  );

  return (
    <div className="pageContainer">
      {/* 🔹 Cabeçalho do calendário */}
      <div className="calendarHeader">
        <button onClick={() => goToMonth(currentMonth - 1, currentYear)}>
          ◀
        </button>
        <h2>
          {new Date(currentYear, currentMonth).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={() => goToMonth(currentMonth + 1, currentYear)}>
          ▶
        </button>
      </div>

      {/* 🔹 Grid do calendário */}
      <div className="gridContainer">
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="days">
          {calendarDays.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="day empty"></div>;
            }

            const dayActivities = getActivitiesByDay(day);

            return (
              <div
                key={day}
                className={`day ${
                  day === new Date().getDate() &&
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear()
                    ? "today"
                    : ""
                }`}
              >
                <span className="date">{day}</span>
                {dayActivities.map((activity) => (
                  <div key={activity.id} className="calendarCard">
                    <strong>{activity.titulo}</strong>
                    <div className="actions">
                      <button
                        className="edit-button"
                        onClick={() => onEditActivity(activity)}
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        className="certification-delete-button"
                        onClick={() => onDeleteActivity(activity.id)}
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
    </div>
  );
};

export default CalendarGrid;
