import type { Group, Todo, TodoCreateRequest, PaginatedResponse } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new ApiError(response.status, `API request failed: ${response.statusText}`);
    }

    return response.json();
}

// Group API
export const groupApi = {
    getAllGroups: (): Promise<Group[]> =>
        apiRequest('/group'),

    addGroup: (group: Omit<Group, 'id'>): Promise<void> =>
        apiRequest('/group', {
            method: 'POST',
            body: JSON.stringify(group),
        }),

    updateGroup: (group: Group): Promise<Group> =>
        apiRequest('/group', {
            method: 'PUT',
            body: JSON.stringify(group),
        }),
};

// Todo API
export const todoApi = {
    getAllTodos: (page = 0, size = 10): Promise<PaginatedResponse<Todo>> =>
        apiRequest(`/todo?page=${page}&size=${size}`),

    getTodoById: (id: number): Promise<Todo> =>
        apiRequest(`/todo/${id}`),

    addTodo: (todo: TodoCreateRequest): Promise<Todo> =>
        apiRequest('/todo/add', {
            method: 'POST',
            body: JSON.stringify(todo),
        }),

    toggleCompleteTodo: (id: number): Promise<Todo> =>
        apiRequest(`/todo/toggleComplete/${id}`, {
            method: 'PUT',
        }),

    deleteTodo: (id: number): Promise<void> =>
        apiRequest(`/todo/${id}`, {
            method: 'DELETE',
        }),

    updateTodo: (id: number, todo: Partial<Todo>): Promise<Todo> =>
        apiRequest(`/todo/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...todo, id }),
        }),
};
