import React, { useEffect, useState } from "react";
import "./styles.css";
import { useNewEventModalController } from "./indexController";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  activity?: any;
  isEditMode?: boolean;
}

const NewEventModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  activity,
  isEditMode = false,
}) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    courses,
    loading,
    error,
    setFormData,
  } = useNewEventModalController(onSubmit, onClose);

  useEffect(() => {
    console.log("Activity received in modal:", activity);
    console.log("Form data after setting:", formData);
    if (isEditMode && activity) {
      setFormData({
        title: activity.titulo || "",
        description: activity.descricao || "",
        startDate: activity.inicio ? activity.inicio.split("T")[0] : "",
        endDate: activity.fim ? activity.fim.split("T")[0] : "",
        course: activity.cursoId || "",
        type: activity.tipo || "Estudo",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        course: "",
        type: "",
      });
    }
  }, [isEditMode, activity, setFormData]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Nova Atividade</h2>
          <p>Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Nova Atividade</h2>
          <p className="error">Erro ao carregar cursos: {error}</p>
          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Nova Atividade</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Descrição:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Data de Início:
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Data de Fim:
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </label>

          {/* <label>
            Curso:
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecione o curso --</option>
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.nome}
                  </option>
                ))
              ) : (
                <option value="">Nenhum curso disponível</option>
              )}
            </select>
          </label>

          <label>
            Tipo:
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">-- Selecione o tipo --</option>
              <option value="simulado">Simulado</option>
              <option value="revisao">Revisão</option>
              <option value="estudo">Estudo</option>
            </select>
          </label> */}

          <div className="modal-actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEventModal;
