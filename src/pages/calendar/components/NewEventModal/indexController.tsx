
import { useCallback, useEffect, useState } from "react";
import type { NewEventFormData, Course } from "./indexModel";
import api from "../../../../api";
import type { AbstractResponse } from "../../../../interfaces/AbstractInterfaces";
import type { Activity } from "../../indexModel";

export const useNewEventModalController = (
  onSubmit: (data: NewEventFormData) => void,
  onClose: () => void
) => {
  const [formData, setFormData] = useState<NewEventFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    course: "",
    type: "",
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get<AbstractResponse<Course[]>>("/certificacoes");
        setCourses(response.data.data || []);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);


  const fetchUserCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<AbstractResponse<Course[]>>("/certificacoes");


      if (!response.data.success) {
        throw new Error("Erro ao buscar cursos do usuário");
      }

      const userCourses = response.data.data || [];
      console.log("User courses:", userCourses); 

      setCourses(userCourses);

      // setFormData(prev => {
      //   if (userCourses.length > 0 && !prev.course) {
      //     return {
      //       ...prev,
      //       course: userCourses[0].id,
      //     };
      //   }
      //   return prev;
      // });
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao buscar cursos");
      console.error("Erro ao buscar cursos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
    }
  }, [formData, onSubmit, onClose]);

//   // Função para recarregar os cursos (caso necessário)
//   const refetchCourses = () => {
//     fetchUserCourses();
//   };

  return {
    formData,
    setFormData, 
    handleChange,
    handleSubmit,
    courses,
    loading,
    error,
  };
};
