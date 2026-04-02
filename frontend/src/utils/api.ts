import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { Group, Todo, TodoCreateRequest, PaginatedResponse } from '../types.ts';

// Define authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  username?: string;
  userId?: number;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to get OIDC token from storage
const getOidcToken = (): string | null => {
  const storageKey = 'oidc.user:https://auth.arorms.cn:arlist-frontend';
  
  // Try sessionStorage first (default)
  let oidcStorage = sessionStorage.getItem(storageKey);
  
  // If not found, try localStorage
  if (!oidcStorage) {
    oidcStorage = localStorage.getItem(storageKey);
  }
  
  if (oidcStorage) {
    try {
      const parsedStorage = JSON.parse(oidcStorage);
      return parsedStorage.access_token || null;
    } catch (e) {
      console.error('Failed to parse OIDC storage:', e);
      return null;
    }
  }
  
  return null;
};

// Create axios instance with base configuration
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '', // Use relative URLs as in original implementation
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token from OIDC storage
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getOidcToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message || error.message || 'API request failed';
        throw new ApiError(status, message);
      } else if (error.request) {
        throw new ApiError(0, 'Network error: No response received from server');
      } else {
        throw new ApiError(0, `Request error: ${error.message}`);
      }
    }
  );

  return instance;
};

const api = createAxiosInstance();

// Group API
export const groupApi = {
  getAllGroups: (): Promise<Group[]> =>
    api.get('/api/group').then((response) => response.data),

  addGroup: (group: { name: string; description: string }): Promise<void> =>
    api.post('/api/group', group),

  updateGroup: (group: Group): Promise<Group> =>
    api.put('/api/group', group).then((response) => response.data),

  updateGroupOrder: (group: Group): Promise<Group> =>
    api.put('/api/group/updateOrder', group).then((response) => response.data),

  deleteGroup: (id: number): Promise<void> =>
    api.delete(`/api/group/${id}`),
};

// Todo API
export const todoApi = {
  getTodos: (page = 0, size = 20, groupId?: number): Promise<PaginatedResponse<Todo>> => {
    let url = `/api/todo?page=${page}&size=${size}`;
    if (groupId !== undefined) {
      url += `&groupId=${groupId}`;
    }
    return api.get(url).then((response) => response.data);
  },

  getTodosWithDeadlines: (page = 0, size = 20): Promise<PaginatedResponse<Todo>> =>
    api.get(`/api/todo/deadline?page=${page}&size=${size}`).then((response) => response.data),

  getAllTodos: (page = 0, size = 20): Promise<PaginatedResponse<Todo>> =>
    api.get(`/api/todo?page=${page}&size=${size}`).then((response) => response.data),

  addTodo: (todo: TodoCreateRequest): Promise<Todo> =>
    api.post('/api/todo/add', todo).then((response) => response.data),

  toggleCompleteTodo: (id: number): Promise<Todo> =>
    api.put(`/api/todo/toggleComplete/${id}`).then((response) => response.data),

  deleteTodo: (id: number): Promise<void> =>
    api.delete(`/api/todo/${id}`),

  updateTodo: (todo: Todo): Promise<Todo> =>
    api.put('/api/todo', todo).then((response) => response.data),
};

// Export the axios instance for custom requests if needed
export { api };

// Export error class
export { ApiError };
