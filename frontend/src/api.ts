import type { Group, Todo, TodoCreateRequest, PaginatedResponse } from './types';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${endpoint}`;
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
        apiRequest('/api/group'),

    addGroup: (group: Omit<Group, 'id'>): Promise<void> =>
        apiRequest('/api/group', {
            method: 'POST',
            body: JSON.stringify(group),
        }),

    updateGroup: (group: Group): Promise<Group> =>
        apiRequest('/api/group', {
            method: 'PUT',
            body: JSON.stringify(group),
        }),

    deleteGroup: (id: number): Promise<void> =>
        apiRequest(`/api/group/${id}`, {
            method: 'DELETE',
        }),
};

// Todo API
export const todoApi = {
    getTodos: (page = 0, size = 20, groupId?: number): Promise<PaginatedResponse<Todo>> => {
        let url = `/api/todo?page=${page}&size=${size}`;
        if (groupId !== undefined) {
            url += `&groupId=${groupId}`;
        }
        return apiRequest(url);
    },

    getAllTodos: (page = 0, size = 20): Promise<PaginatedResponse<Todo>> =>
        apiRequest(`/api/todo?page=${page}&size=${size}`),

    addTodo: (todo: TodoCreateRequest): Promise<Todo> =>
        apiRequest('/api/todo/add', {
            method: 'POST',
            body: JSON.stringify(todo),
        }),

    toggleCompleteTodo: (id: number): Promise<Todo> =>
        apiRequest(`/api/todo/toggleComplete/${id}`, {
            method: 'PUT',
        }),

    deleteTodo: (id: number): Promise<void> =>
        apiRequest(`/api/todo/${id}`, {
            method: 'DELETE',
        }),

    updateTodo: (todo: Todo): Promise<Todo> =>
        apiRequest(`/api/todo`, {
            method: 'PUT',
            body: JSON.stringify({ ...todo }),
        }),
};
