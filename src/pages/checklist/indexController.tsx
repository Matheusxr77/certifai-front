import api from "../../api";
import { useEffect } from "react";
import type { AbstractResponse } from "../../interfaces/AbstractInterfaces";
import type { ChecklistItem } from "./components/ChecklistModal/indexModel";
import { useChecklistModel, type Checklist } from "./indexModel";

export const useChecklistController = () => {
  const { model, updateModel, getFilteredChecklists } = useChecklistModel();

  useEffect(() => {
    const loadChecklists = async () => {
      try {
        updateModel({ isLoading: true });
        const response = await api.get<AbstractResponse<Checklist[]>>(
          "/checklist"
        );

        if (response.status === 200 && response.data.data) {
          updateModel({
            checklists: response.data.data,
            isLoading: false,
          });
        } else {
          throw new Error("Erro ao carregar checklists");
        }
      } catch (error) {
        console.error("Erro ao carregar checklists:", error);
        updateModel({ error: "Erro ao carregar checklists", isLoading: false });
      }
    };

    loadChecklists();
  }, []);

  const openChecklistModal = (checklist: Checklist | null) => {
    updateModel({
      selectedChecklist: checklist,
      showModal: true,
    });
  };

  const closeModal = () => {
    updateModel({
      showModal: false,
      selectedChecklist: null,
    });
  };

  const refreshChecklists = async () => {
    try {
      updateModel({ isLoading: true });
      const response = await api.get<AbstractResponse<Checklist[]>>(
        "/checklist"
      );

      if (response.status === 200 && response.data.data) {
        updateModel({
          checklists: response.data.data,
          isLoading: false,
        });
      } else {
        throw new Error("Erro ao carregar checklists");
      }
    } catch (error) {
      console.error("Erro ao carregar checklists:", error);
      updateModel({ error: "Erro ao carregar checklists", isLoading: false });
    }
  };

  const handleCreateChecklist = async (
    nome: string,
    itens: ChecklistItem[],
    certificacaoId: number
  ) => {
    console.log(certificacaoId);
    try {
      if (!nome.trim()) {
       // alert("Por favor, informe um nome para a checklist");
        return;
      }

      if (!certificacaoId || certificacaoId <= 0) {
       // alert("Por favor, selecione uma certificação");
        return;
      }

      const itensChecklistValidos = itens
        .filter((item) => item.descricao.trim() !== "")
        .map((item) => ({
          descricao: item.descricao,
          concluido: item.concluido,
          conclusao: item.concluido ? new Date().toISOString() : "1970-01-01T00:00:00.000Z"
        }));

      if (itensChecklistValidos.length === 0) {
       // alert("Por favor, adicione pelo menos um item à checklist");
        return;
      }

      const checklistDTO = {
        nome,
        certificacao_id: certificacaoId,
        itensChecklist: itensChecklistValidos,
      };

      console.log("Enviando checklist:", checklistDTO);

      const response = await api.post<AbstractResponse<Checklist>>(
        "/checklist",
        checklistDTO
      );

      if (response.status === 201 && response.data) {
        console.log("Checklist criada com sucesso:", response.data);
        //alert("Checklist criada com sucesso!");
        refreshChecklists(); 
      } else {
        throw new Error(response.statusText || "Erro ao criar checklist");
      }
    } catch (error) {
      console.error("Erro ao criar checklist:", error);
     // alert(
     //   `Erro ao criar checklist: ${
      //    error instanceof Error ? error.message : "Erro desconhecido"
      //  }`
      //);
    }
  };

  // const handleToggleItem = async (
  //   itemId: number,
  //   concluido: boolean
  // ) => {
  //   try {
  //     await api.put<AbstractResponse<Checklist>>(
  //       `/itens-checklist/${itemId}`,
  //       concluido
  //     );
  //     refreshChecklists();
  //   } catch (error) {
  //     console.error("Erro ao atualizar item:", error);
  //   }
  // };

  const handleUpdateChecklist = async (
    id: number,
    nome: string,
    itens: any[],
    certificacaoId: number
  ) => {
    try {
      console.log("Atualizando checklist:", { id, nome, itens, certificacaoId });
      
      const itensChecklistValidos = itens.map((item) => ({
        descricaoItem: item.descricao || item.descricaoItem,
        concluido: item.concluido,
        conclusao: item.concluido ? new Date().toISOString() : "1970-01-01T00:00:00.000Z"
      }));
  
      const checklistDTO = {
        nome,
        certificacao_id: certificacaoId,
        itensChecklist: itensChecklistValidos,
      };
  
      console.log("DTO de atualização:", checklistDTO);
  
      const response = await api.put<AbstractResponse<Checklist>>(
        `/checklist/${id}`,
        checklistDTO
      );
  
      if (response.status === 200) {
        alert("Checklist atualizada com sucesso!");
        refreshChecklists();
      }
    } catch (error) {
      console.error("Erro ao atualizar checklist:", error);
      alert("Erro ao atualizar checklist");
    }
  };

  const handleDeleteChecklist = async (
    checklistId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await api.delete<AbstractResponse<void>>(`/checklist/${checklistId}`);

      refreshChecklists();
    } catch (error) {
      console.error("Erro ao deletar checklist:", error);
    }
  };

  return {
    filteredChecklists: getFilteredChecklists(),
    isLoading: model.isLoading,
    error: model.error,
    showModal: model.showModal,
    selectedChecklist: model.selectedChecklist,
    isSidebarExpanded: model.isSidebarExpanded,
    toggleSidebar: () =>
      updateModel({ isSidebarExpanded: !model.isSidebarExpanded }),

    openChecklistModal,
    closeModal,
    refreshChecklists,
    handleDeleteChecklist,
    handleUpdateChecklist,
  //  handleToggleItem,
    handleCreateChecklist,
  };
};

export type ChecklistController = ReturnType<typeof useChecklistController>;
