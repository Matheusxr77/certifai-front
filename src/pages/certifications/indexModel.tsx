export interface CertificationData {
    id: number;
    nome: string;
    descricao?: string;
    dificuldade: DifficultyLevel;
    tempo?: number;
}

export interface CertificationFormData {
    nome: string;
    descricao?: string;
    dificuldade: DifficultyLevel;
    tempo?: number;
}

export type DifficultyLevel = 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO';

export interface CertificationsControllerHook {
    certifications: CertificationData[];
    filteredCertifications: CertificationData[];
    isLoading: boolean;
    error: string | null;
    success: string | null;
    showCreateModal: boolean;
    showEditModal: boolean;
    showDeleteModal: boolean;
    selectedCertification: CertificationData | null;
    searchTerm: string;
    difficultyFilter: DifficultyLevel | '';
    handleCreateCertification: (data: CertificationFormData) => Promise<void>;
    handleEditCertification: (id: number, data: CertificationFormData) => Promise<void>;
    handleDeleteCertification: (id: number) => Promise<void>;
    openCreateModal: () => void;
    openEditModal: (certification: CertificationData) => void;
    openDeleteModal: (certification: CertificationData) => void;
    closeModals: () => void;
    refreshCertifications: () => Promise<void>;
    getDifficultyLabel: (difficulty: DifficultyLevel) => string;
    getDifficultyColor: (difficulty: DifficultyLevel) => string;
    formatTime: (timeInMinutes?: number) => string;
    handleSearchChange: (term: string) => void;
    handleDifficultyFilterChange: (difficulty: DifficultyLevel | '') => void;
    clearFilters: () => void;
}

export const DIFFICULTY_OPTIONS = [
    { value: 'BASICO' as DifficultyLevel, label: 'Básico' },
    { value: 'INTERMEDIARIO' as DifficultyLevel, label: 'Intermediário' },
    { value: 'AVANCADO' as DifficultyLevel, label: 'Avançado' }
];

export const CERTIFICATIONS_CONSTANTS = {
    PAGE_TITLE: 'Certificações',
    CREATE_BUTTON_TEXT: 'Nova Certificação',
    LOADING_MESSAGE: 'Carregando certificações...',
    SUCCESS_CREATE_MESSAGE: 'Certificação criada com sucesso!',
    SUCCESS_UPDATE_MESSAGE: 'Certificação atualizada com sucesso!',
    SUCCESS_DELETE_MESSAGE: 'Certificação excluída com sucesso!',
    ERROR_CREATE_MESSAGE: 'Erro ao criar certificação',
    ERROR_UPDATE_MESSAGE: 'Erro ao atualizar certificação',
    ERROR_DELETE_MESSAGE: 'Erro ao excluir certificação',
    ERROR_LOAD_MESSAGE: 'Erro ao carregar certificações',
    CONFIRM_DELETE_MESSAGE: 'Tem certeza que deseja excluir esta certificação?',
    NAME_LABEL: 'Nome',
    DESCRIPTION_LABEL: 'Descrição',
    DIFFICULTY_LABEL: 'Dificuldade',
    TIME_LABEL: 'Tempo (minutos)',
    TIME_LABEL_EXIBITION: 'Tempo:',
    NAME_PLACEHOLDER: 'Digite o nome da certificação',
    DESCRIPTION_PLACEHOLDER: 'Digite a descrição da certificação',
    TIME_PLACEHOLDER: 'Digite o tempo em minutos (opcional)',
    EDIT_BUTTON_TEXT: 'Editar',
    DELETE_BUTTON_TEXT: 'Excluir',
    SAVE_BUTTON_TEXT: 'Salvar',
    CANCEL_BUTTON_TEXT: 'Cancelar',
    CREATING_BUTTON_TEXT: 'Criando...',
    UPDATING_BUTTON_TEXT: 'Atualizando...',
    DELETING_BUTTON_TEXT: 'Excluindo...',
    CREATE_MODAL_TITLE: 'Nova Certificação',
    EDIT_MODAL_TITLE: 'Editar Certificação',
    DELETE_MODAL_TITLE: 'Excluir Certificação',
    DELETE_CONFIRMATION_TEXT: 'Esta ação não pode ser desfeita.',
    EMPTY_STATE_TITLE: 'Nenhuma certificação encontrada',
    EMPTY_STATE_ONE_CERTIFICATION: '1 certificação encontrada',
    EMPTY_STATE_MULTIPLE_CERTIFICATIONS: 'certificações encontradas',
    EMPTY_STATE_SUBTITLE: 'Comece criando sua primeira certificação',
    SEARCH_PLACEHOLDER: 'Buscar por certificações...',
    ALL_DIFFICULTIES: 'Todos os níveis',
    CERTIFICATIONS_LIST_TITLE: 'Lista de Certificações'
};

export const CERTIFICATIONS_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    VALIDATION_ERROR: 'Dados inválidos fornecidos.',
    UNAUTHORIZED: 'Você não tem permissão para esta ação.',
    NOT_FOUND: 'Certificação não encontrada.',
    SERVER_ERROR: 'Erro interno do servidor.',
    UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
    NAME_REQUIRED: 'Nome é obrigatório',
    NAME_MIN_LENGTH: 'Nome deve ter pelo menos 3 caracteres',
    NAME_MAX_LENGTH: 'Nome deve ter no máximo 100 caracteres',
    DIFFICULTY_REQUIRED: 'Dificuldade é obrigatória',
    TIME_INVALID: 'Tempo deve ser um número válido'
};

export type CertificationsErrorType = 
    | 'NETWORK_ERROR'
    | 'VALIDATION_ERROR'
    | 'UNAUTHORIZED'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR';