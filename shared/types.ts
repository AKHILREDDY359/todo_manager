export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  category?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  subtasks: Subtask[];
  order: number;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  order: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  category?: string;
  dueDate?: Date;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completed?: boolean;
  order?: number;
}

export interface TaskFilters {
  search?: string;
  status?: 'all' | 'completed' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
}

export interface TaskSort {
  field: 'title' | 'createdAt' | 'dueDate' | 'priority' | 'order';
  direction: 'asc' | 'desc';
}

export type ThemeMode = 'light' | 'dark';

export interface AppState {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  loading: boolean;
  error: string | null;
  theme: ThemeMode;
}
