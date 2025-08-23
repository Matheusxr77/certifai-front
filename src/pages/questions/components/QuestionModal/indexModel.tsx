import type { Categoria, Dificuldade } from '../../indexModel';

export interface Alternativa {
    id: number;
    idQuestao: number;
    texto: string;
    correta: boolean;
}

export interface Questao {
    id: number;
    enunciado: string;
    categoria: Categoria;
    dificuldade: Dificuldade;
    alternativas: Alternativa[];
}

export interface QuestionModalProps {
    isOpen: boolean;
    isEdit: boolean;
    questao?: Questao | null;
    onSave: (data: Questao) => Promise<void>;
    onClose: () => void;
}