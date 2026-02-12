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

// Token management
const TOKEN_KEY = 'token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Create axios instance with base configuration
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '', // Use relative URLs as in original implementation
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
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

// Authentication API
export const authApi = {
  register: async (data: RegisterRequest): Promise<void> => {
    await api.post('/api/auth/register', data);
    // Register doesn't return token, need to login after registration
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    const { access_token } = response.data;
    if (access_token) {
      setToken(access_token);
    }
    return response.data;
  },

  logout: (): void => {
    removeToken();
  },

  getCurrentUser: (): { token: string | null; isAuthenticated: boolean } => {
    const token = getToken();
    return {
      token,
      isAuthenticated: !!token,
    };
  },
};

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
