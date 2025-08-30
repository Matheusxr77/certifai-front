export interface NewEventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  course: string;
  type: "simulado" | "revisao" | "estudo" | "";
}

export interface Course {
  id: string;
  nome: string;
}
