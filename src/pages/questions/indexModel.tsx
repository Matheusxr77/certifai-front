export type Categoria = 'NUVEM' | 'DEV' | 'BANCO' | 'INFRA';
export type Dificuldade = 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO';

export interface Alternativa {
    id: number;
    idQuestao: number;
    texto: string;
    correta: boolean;
}

export interface Resposta {
    id: number;
    idProva: number;
    idQuestao: number;
    idAlternativa: number;
    acertou: boolean;
}

export interface Questao {
    id: number;
    enunciado: string;
    categoria: Categoria;
    dificuldade: Dificuldade;
    alternativas: Alternativa[];
}

export interface Prova {
    id: number;
    idUsuario: number;
    idCertificacao: number;
    pontuacao: number;
    cronometro: boolean;
    categoria: Categoria;
    tempo: number;
}

export interface QuestionsControllerHook {
    questoes: Questao[];
    isLoading: boolean;
    error: string | null;
    showCreateModal: boolean;
    showEditModal: boolean;
    showDeleteModal: boolean;
    selectedQuestao: Questao | null;
    handleCreateQuestao: (data: Questao) => Promise<void>;
    handleEditQuestao: (id: number, data: Questao) => Promise<void>;
    handleDeleteQuestao: (id: number) => Promise<void>;
    openCreateModal: () => void;
    openEditModal: (questao: Questao) => void;
    openDeleteModal: (questao: Questao) => void;
    closeModals: () => void;
    refreshQuestoes: () => Promise<void>;
}

export const CATEGORIA_OPTIONS = [
    { value: 'NUVEM' as Categoria, label: 'Computação em Nuvem' },
    { value: 'DEV' as Categoria, label: 'Desenvolvimento de Software' },
    { value: 'BANCO' as Categoria, label: 'Banco de Dados' },
    { value: 'INFRA' as Categoria, label: 'Infraestrutura' }
];

export const DIFICULDADE_OPTIONS = [
    { value: 'BASICO' as Dificuldade, label: 'Básico' },
    { value: 'INTERMEDIARIO' as Dificuldade, label: 'Intermediário' },
    { value: 'AVANCADO' as Dificuldade, label: 'Avançado' }
];

export const QUESTIONS_CONSTANTS = {
    PAGE_TITLE: 'Questões',
    CREATE_BUTTON_TEXT: 'Nova Questão',
    LOADING_MESSAGE: 'Carregando questões...',
    SUCCESS_CREATE_MESSAGE: 'Questão criada com sucesso!',
    SUCCESS_UPDATE_MESSAGE: 'Questão atualizada com sucesso!',
    SUCCESS_DELETE_MESSAGE: 'Questão excluída com sucesso!',
    ERROR_CREATE_MESSAGE: 'Erro ao criar questão',
    ERROR_UPDATE_MESSAGE: 'Erro ao atualizar questão',
    ERROR_DELETE_MESSAGE: 'Erro ao excluir questão',
    ERROR_LOAD_MESSAGE: 'Erro ao carregar questões',
    CONFIRM_DELETE_MESSAGE: 'Tem certeza que deseja excluir esta questão?',
    ENUNCIADO_LABEL: 'Enunciado',
    CATEGORIA_LABEL: 'Categoria',
    DIFICULDADE_LABEL: 'Dificuldade',
    ALTERNATIVAS_LABEL: 'Alternativas',
    SAVE_BUTTON_TEXT: 'Salvar',
    CANCEL_BUTTON_TEXT: 'Cancelar',
    EDIT_BUTTON_TEXT: 'Editar',
    DELETE_BUTTON_TEXT: 'Excluir',
    CREATE_MODAL_TITLE: 'NOVA QUESTÃO',
    EDIT_MODAL_TITLE: 'EDITAR QUESTÃO',
    DELETE_MODAL_TITLE: 'EXCLUIR QUESTÃO',
    DELETE_CONFIRMATION_TEXT: 'Esta ação não pode ser desfeita.',
    EMPTY_STATE_TITLE: 'Nenhuma questão encontrada',
    EMPTY_STATE_ONE_QUESTION: '1 questão encontrada',
    EMPTY_STATE_MULTIPLE_QUESTIONS: 'questões encontradas',
    EMPTY_STATE_SUBTITLE: 'Comece criando sua primeira questão',
    SEARCH_PLACEHOLDER: 'Buscar por questões...',
    QUESTIONS_LIST_TITLE: 'Lista de Questões'
};