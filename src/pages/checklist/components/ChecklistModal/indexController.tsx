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
    certificacaoId: number
  ) => void,
  onUpdate: (
    id: number,
    nome: string,
    itensChecklist: ChecklistItem[],
    certificacaoId: number
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
            itensChecklist: (checklist!.itensChecklist || []).map((item) => ({
              id: item.id ?? Date.now(),
              descricao: item.descricao || "",
              concluido: item.concluido ?? false,
            })),
          },
    nome: checklist?.nome || "",
    itensChecklist:
      mode === "create"
        ? [{ id: Date.now(), descricao: "", concluido: false }]
        : (checklist?.itensChecklist || []).map((item) => ({
            id: item.id ?? Date.now(),
            descricao: item.descricao ?? "",
            concluido: item.concluido ?? false,
          })),

    certificacaoId: checklist?.certificacaoId || null,
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

      if (field === "certificacaoId") {
        return { ...prev, [field]: Number(value) };
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
      //alert("Por favor, informe um nome para a checklist");
      return;
    }

    if (model.certificacaoId === null) {
     // alert("Por favor, selecione uma certificação");
      return;
    }

    const itensChecklistValidos = model.itensChecklist.filter(
      (item) => item.descricao.trim() !== ""
    ).map(item => ({
      ...item,
      conclusao: item.concluido ? new Date().toISOString() : null
    }));

    if (itensChecklistValidos.length === 0) {
     // alert("Por favor, adicione pelo menos um item à checklist");
      return;
    }

    if (mode === "create") {
      onCreate(model.nome, itensChecklistValidos, model.certificacaoId);
    } else {
      onUpdate(checklist!.id, model.nome, itensChecklistValidos, model.certificacaoId);
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
