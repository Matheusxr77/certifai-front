// Interface genérica para respostas da API
export interface AbstractResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Interface para resposta de erro
export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
    details?: any;
}

// Interface para resposta de sucesso
export interface SuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

// Interface para paginação
export interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Interface para resposta paginada
export interface PaginatedResponse<T> extends AbstractResponse<T[]> {
    pagination: PaginationData;
}

// Interface para filtros genéricos
export interface BaseFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    startDate?: string;
    endDate?: string;
}

// Interface para ordenação
export interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
}

// Interface para parâmetros de busca
export interface SearchParams {
    query: string;
    filters?: Record<string, any>;
    sort?: SortOptions;
    pagination?: Pick<PaginationData, 'page' | 'limit'>;
}

// Interface para resposta de busca
export interface SearchResponse<T> {
    results: T[];
    total: number;
    query: string;
    executionTime: number;
    suggestions?: string[];
}

// Interface para validação genérica
export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
}

// Interface para campos de formulário
export interface FormField {
    name: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea';
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string; label: string }[];
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        custom?: (value: any) => boolean;
    };
}

// Interface para estado de carregamento
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
    lastUpdated?: string;
}

// Interface para operações CRUD
export interface CrudOperations<T> {
    create: (data: Omit<T, 'id'>) => Promise<AbstractResponse<T>>;
    read: (id: string | number) => Promise<AbstractResponse<T>>;
    update: (id: string | number, data: Partial<T>) => Promise<AbstractResponse<T>>;
    delete: (id: string | number) => Promise<AbstractResponse<boolean>>;
    list: (filters?: BaseFilters) => Promise<PaginatedResponse<T>>;
}

// Interface para configuração de API
export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    headers?: Record<string, string>;
    retryAttempts?: number;
    retryDelay?: number;
}

// Interface para resposta de API
export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

// Interface para erro de API
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: any;
    timestamp: string;
}

// Interface para cache
export interface CacheConfig {
    enabled: boolean;
    ttl: number; // tempo de vida em segundos
    maxSize: number;
    strategy: 'lru' | 'fifo' | 'ttl';
}

// Interface para log
export interface LogEntry {
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    timestamp: string;
    context?: Record<string, any>;
}

// Interface para configuração de componente
export interface ComponentConfig {
    name: string;
    version: string;
    dependencies?: string[];
    props?: Record<string, any>;
    defaultProps?: Record<string, any>;
}

// Interface para tema
export interface ThemeConfig {
    name: string;
    colors: Record<string, string>;
    fonts: Record<string, string>;
    spacing: Record<string, string>;
    breakpoints: Record<string, string>;
}

// Interface para notificação
export interface NotificationConfig {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    position?: 'top' | 'bottom' | 'center';
    closable?: boolean;
}

// Interface para estado global
export interface GlobalState {
    isLoading: boolean;
    error: string | null;
    theme: string;
    language: string;
    notifications: NotificationConfig[];
    user: any;
    permissions: string[];
}

// Interface para ação do reducer
export interface ReducerAction<T = any> {
    type: string;
    payload?: T;
    meta?: Record<string, any>;
}

// Interface para resultado de hook
export interface HookResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// Interface para contexto
export interface ContextValue<T> {
    state: T;
    dispatch: (action: ReducerAction) => void;
}