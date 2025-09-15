export type Status = 'PENDENTE' | 'ANDAMENTO' | 'CONCLUIDA';

export interface TestData {
    id: number;
    nome: string;
    pontuacao: number;
    tempo: number;
    comTempo: boolean;
    status: Status;
    certificacao: {
        id: number;
        nome: string;
        dificuldade: string;
    };
    usuario: {
        id: number;
        nome: string;
    };
    numeroDeQuestoes: number;
    dificuldadeQuestoes: string;
}

export interface TestFormData {
    nome: string;
    pontuacao: number;
    tempo: number;
    comTempo: boolean;
    status: Status;
    certificacaoId: number;
    numeroDeQuestoes: number;
    dificuldadeQuestoes: string;
}

export const STATUS_OPTIONS = [
    { value: 'PENDENTE', label: 'Não iniciada' },
    { value: 'ANDAMENTO', label: 'Em andamento' },
    { value: 'CONCLUIDA', label: 'Concluída' }
];

export const TESTS_CONSTANTS = {
    PAGE_TITLE: 'Provas',
    CREATE_BUTTON_TEXT: 'Nova Prova',
    EDIT_BUTTON_TEXT: 'Editar',
    DELETE_BUTTON_TEXT: 'Excluir',
    SAVE_BUTTON_TEXT: 'Salvar',
    CANCEL_BUTTON_TEXT: 'Cancelar',
    LOADING_MESSAGE: 'Carregando provas...',
    CREATE_MODAL_TITLE: 'Montar Prova',
    EDIT_MODAL_TITLE: 'Editar Prova',
    DELETE_MODAL_TITLE: 'Excluir Prova',
    DELETING_BUTTON_TEXT: 'Excluindo...',
    CREATING_BUTTON_TEXT: 'Criando...',
    UPDATING_BUTTON_TEXT: 'Atualizando...',
    SEARCH_PLACEHOLDER: 'Buscar por provas...',
    ALL_STATUS: 'Todos os status',
    TESTS_LIST_TITLE: 'Lista de Provas',
    EMPTY_STATE_TITLE: 'Nenhuma prova encontrada',
    EMPTY_STATE_SUBTITLE: 'Crie uma prova para começar.',
    EMPTY_STATE_ONE_TEST: '1 prova encontrada',
    EMPTY_STATE_MULTIPLE_TESTS: 'provas encontradas',
    STATUS_LABEL: 'Status',
    NAME_LABEL: 'Nome',
    SCORE_LABEL: 'Pontuação',
    TIME_LABEL: 'Tempo',
    CERTIFICATION_LABEL: 'Certificação',
    USER_LABEL: 'Usuário',
    WITH_TIME_LABEL: 'Com tempo',
    WITHOUT_TIME_LABEL: 'Sem tempo',
    DELETE_CONFIRMATION_TEXT: 'Esta ação não pode ser desfeita.',
    TIME_PLACEHOLDER: 'Tempo (minutos)',
    SCORE_PLACEHOLDER: 'Pontuação',
    CERTIFICATION_PLACEHOLDER: 'Selecione a certificação',
    STATUS_PLACEHOLDER: 'Selecione o status'
};
