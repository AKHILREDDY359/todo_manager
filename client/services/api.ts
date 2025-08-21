import axios from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, Subtask } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      subtasks: task.subtasks.map(subtask => ({
        ...subtask,
        createdAt: new Date(subtask.createdAt),
      }))
    }));
  },

  // Create a new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    const task = response.data;
    return {
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      subtasks: task.subtasks.map(subtask => ({
        ...subtask,
        createdAt: new Date(subtask.createdAt),
      }))
    };
  },

  // Update a task
  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, taskData);
    const task = response.data;
    return {
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      subtasks: task.subtasks.map(subtask => ({
        ...subtask,
        createdAt: new Date(subtask.createdAt),
      }))
    };
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Reorder tasks
  reorderTasks: async (taskIds: string[]): Promise<Task[]> => {
    const response = await api.put<Task[]>('/tasks/reorder', { taskIds });
    return response.data.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      subtasks: task.subtasks.map(subtask => ({
        ...subtask,
        createdAt: new Date(subtask.createdAt),
      }))
    }));
  },

  // Subtask operations
  addSubtask: async (taskId: string, title: string): Promise<Subtask> => {
    const response = await api.post<Subtask>(`/tasks/${taskId}/subtasks`, { title });
    const subtask = response.data;
    return {
      ...subtask,
      createdAt: new Date(subtask.createdAt),
    };
  },

  updateSubtask: async (taskId: string, subtaskId: string, data: Partial<Subtask>): Promise<Subtask> => {
    const response = await api.put<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
    const subtask = response.data;
    return {
      ...subtask,
      createdAt: new Date(subtask.createdAt),
    };
  },

  deleteSubtask: async (taskId: string, subtaskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  },
};

export default api;
