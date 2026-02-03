export interface Group {
    id: number;
    name: string;
    description: string;
    orderIndex: number | null;
}

export interface Todo {
    id: number;
    group: Group | null;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: string;
    deadline: string;
}

export interface TodoCreateRequest {
    title: string;
    description?: string;
    group?: {
        id: number;
    };
}

export interface PaginatedResponse<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}
