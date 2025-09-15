import { useEffect, useState } from "react";
import type {
  ChecklistModalModel,
  ChecklistModalMode,
  ChecklistItem,
} from "./indexModel";
import type { Checklist } from "../../indexModel";
import type { AbstractResponse } from "../../../../interfaces/AbstractInterfaces";
import api from "../../../../api";

export const useChecklistModalController = (
  mode: ChecklistModalMode,
  checklist: Checklist | null,
  onCreate: (
    nome: string,
    itensChecklist: ChecklistItem[],
    certificacao_id: number,
    descricao?: string
  ) => void,
  onUpdate: (
    id: number,
    nome: string,
    itensChecklist: ChecklistItem[],
    certificacao_id: number,
    descricao?: string
  ) => void,
  onClose: () => void
) => {
  const [model, setModel] = useState<ChecklistModalModel>({
    mode,
    checklist:
      mode === "create"
        ? null
        : {
            id: checklist!.id,
            nome: checklist!.nome,
            descricao: checklist!.descricao || "",
            itensChecklist: (checklist!.itensChecklist || []).map((item) => ({
              id: item.id ?? Date.now(),
              descricao: item.descricao || "",
              concluido: item.concluido ?? false,
            })),
          },
    nome: checklist?.nome || "",
    descricao: checklist?.descricao || "",
    itensChecklist:
      mode === "create"
        ? [{ id: Date.now(), descricao: "", concluido: false }]
        : (checklist?.itensChecklist || []).map((item) => ({
            id: item.id ?? Date.now(),
            descricao: item.descricao ?? "",
            concluido: item.concluido ?? false,
          })),

    certificacao_id: checklist?.certificacao_id || null,
  });


  const [certificacoes, setCertificacoes] = useState<
    { id: number; nome: string }[]
  >([]);

  useEffect(() => {
    const loadCertificacoes = async () => {
      try {
        const response = await api.get<
          AbstractResponse<{ id: number; nome: string }[]>
        >("/certificacoes");
        if (response.status === 200 && response.data.data) {
          setCertificacoes(response.data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar certificações:", error);
      }
    };
    loadCertificacoes();
  }, []);

  const handleAddItem = () => {
    setModel((prev) => ({
      ...prev,
      itensChecklist: [
        ...prev.itensChecklist,
        {
          id: Date.now(),
          descricao: "",
          concluido: false,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (model.itensChecklist.length > 1) {
      setModel((prev) => ({
        ...prev,
        itensChecklist: prev.itensChecklist.filter((_, i) => i !== index),
      }));
    }
  };

  const updateField = (field: string, value: any, index?: number) => {
    setModel((prev) => {
      if (field === "itens" && index !== undefined) {
        const newItensChecklist = [...prev.itensChecklist];
        newItensChecklist[index] = {
          ...newItensChecklist[index],
          descricao: value,
        };
        return { ...prev, itensChecklist: newItensChecklist };
      }
      if (field === "certificacao_id") {
        return { ...prev, [field]: Number(value) };
      }
      if (field === "descricao") {
        return { ...prev, descricao: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const updateItem = (index: number, updates: Partial<ChecklistItem>) => {
    setModel((prev) => {
      const newItensChecklist = [...prev.itensChecklist];
      newItensChecklist[index] = {
        ...newItensChecklist[index],
        ...updates,
      };
      return { ...prev, itensChecklist: newItensChecklist };
    });
  };

  const handleSubmit = () => {
    console.log("Submit chamado, modo:", mode);
    console.log("Dados do model:", model);
    
    if (!model.nome.trim()) {
      return;
    }

    if (model.certificacao_id === null) {
      return;
    }

    const itensChecklistValidos = model.itensChecklist.filter(
      (item) => item.descricao.trim() !== ""
    ).map(item => ({
      ...item,
      conclusao: item.concluido ? new Date().toISOString() : null
    }));

    if (itensChecklistValidos.length === 0) {
      return;
    }

    if (mode === "create") {
      onCreate(model.nome, itensChecklistValidos, model.certificacao_id, model.descricao);
    } else {
      onUpdate(checklist!.id, model.nome, itensChecklistValidos, model.certificacao_id, model.descricao);
    }
   

    onClose();
  };

  return {
    model,
    updateField,
    certificacoes,
    setModel,
    updateItem,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
  };
};