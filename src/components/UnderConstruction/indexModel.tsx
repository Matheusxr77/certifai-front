export interface UnderConstructionProps {
    title?: string;
    subtitle?: string;
    showBackButton?: boolean;
    showHomeButton?: boolean;
}

export interface UnderConstructionState {
    title: string;
    subtitle: string;
    showBackButton: boolean;
    showHomeButton: boolean;
}

export const defaultProps: Required<UnderConstructionProps> = {
    title: "Página em Construção",
    subtitle: "Esta funcionalidade está sendo desenvolvida e estará disponível em breve!",
    showBackButton: true,
    showHomeButton: true
};