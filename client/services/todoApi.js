import axios from 'axios';

/**
 * API service for Todo Manager
 * Handles all HTTP requests to the backend Spring Boot API
 * Features:
 * - CRUD operations for tasks and subtasks
 * - Error handling and response transformation
 * - Loading states management
 * - Ready for Spring Boot + MySQL backend integration
 */

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth tokens (if needed)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
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
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 
                   error.message || 
                   'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);

/**
 * Mock data for demo purposes when backend is not available
 */
const getMockTasks = () => {
  return [
    {
      id: '1',
      title: 'Welcome to TaskFlow!',
      description: 'This is a demo task to showcase the todo manager features.',
      completed: false,
      priority: 'high',
      tags: ['demo', 'welcome'],
      category: 'Getting Started',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [
        {
          id: 'sub1',
          taskId: '1',
          title: 'Explore the interface',
          completed: true,
          createdAt: new Date(),
          order: 0
        },
        {
          id: 'sub2',
          taskId: '1',
          title: 'Try adding a new task',
          completed: false,
          createdAt: new Date(),
          order: 1
        }
      ],
      order: 0
    },
    {
      id: '2',
      title: 'Build amazing projects',
      description: 'Use this todo manager to organize your work and boost productivity.',
      completed: false,
      priority: 'medium',
      tags: ['productivity', 'projects'],
      category: 'Work',
      dueDate: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(),
      subtasks: [],
      order: 1
    },
    {
      id: '3',
      title: 'Learn React and modern web development',
      description: 'Master the latest technologies and frameworks.',
      completed: true,
      priority: 'low',
      tags: ['learning', 'react', 'javascript'],
      category: 'Study',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(),
      subtasks: [
        {
          id: 'sub3',
          taskId: '3',
          title: 'Complete React tutorial',
          completed: true,
          createdAt: new Date(),
          order: 0
        }
      ],
      order: 2
    },
    {
      id: '4',
      title: 'Prepare for Math Exam',
      description: 'Study calculus and linear algebra for the upcoming semester exam.',
      completed: false,
      priority: 'high',
      tags: ['math', 'exam', 'calculus'],
      category: 'Study',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(),
      subtasks: [
        {
          id: 'sub4',
          taskId: '4',
          title: 'Review chapter 1-5',
          completed: false,
          createdAt: new Date(),
          order: 0
        },
        {
          id: 'sub5',
          taskId: '4',
          title: 'Practice problems',
          completed: false,
          createdAt: new Date(),
          order: 1
        }
      ],
      order: 3
    }
  ];
};

/**
 * Transform date strings to Date objects for consistent handling
 */
const transformTaskDates = (task) => {
  return {
    ...task,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    subtasks: task.subtasks?.map(subtask => ({
      ...subtask,
      createdAt: subtask.createdAt ? new Date(subtask.createdAt) : new Date(),
    })) || []
  };
};

/**
 * Todo API endpoints
 */
const todoApi = {
  /**
   * Fetch all tasks from the backend
   */
  getTasks: async () => {
    try {
      const response = await apiClient.get('/tasks');
      // Ensure response.data is an array
      const tasks = Array.isArray(response.data) ? response.data : [];
      return tasks.map(transformTaskDates);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Return mock data for demo purposes when backend is not available
      return getMockTasks();
    }
  },

  /**
   * Create a new task
   */
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/tasks', {
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return transformTaskDates(response.data);
    } catch (error) {
      console.error('Error creating task:', error);
      // Return mock created task for demo
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
        order: Date.now()
      };
      return newTask;
    }
  },

  /**
   * Update an existing task
   */
  updateTask: async (taskId, taskData) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, {
        ...taskData,
        updatedAt: new Date().toISOString(),
      });
      return transformTaskDates(response.data);
    } catch (error) {
      console.error('Error updating task:', error);
      // Return mock updated task for demo
      return {
        id: taskId,
        ...taskData,
        updatedAt: new Date()
      };
    }
  },

  /**
   * Delete a task
   */
  deleteTask: async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      // Silently succeed for demo purposes
      console.log('Task deleted (demo mode):', taskId);
    }
  },

  /**
   * Reorder tasks (for drag and drop)
   */
  reorderTasks: async (taskIds) => {
    try {
      const response = await apiClient.put('/tasks/reorder', {
        taskIds,
        updatedAt: new Date().toISOString(),
      });
      return response.data.map(transformTaskDates);
    } catch (error) {
      console.error('Error reordering tasks:', error);
      throw error;
    }
  },

  /**
   * Add a subtask to a parent task
   */
  addSubtask: async (taskId, subtaskData) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/subtasks`, {
        ...subtaskData,
        createdAt: new Date().toISOString(),
      });
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      console.error('Error adding subtask:', error);
      throw error;
    }
  },

  /**
   * Update a subtask
   */
  updateSubtask: async (taskId, subtaskId, subtaskData) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      console.error('Error updating subtask:', error);
      throw error;
    }
  },

  /**
   * Delete a subtask
   */
  deleteSubtask: async (taskId, subtaskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    } catch (error) {
      console.error('Error deleting subtask:', error);
      throw error;
    }
  },

  /**
   * Search tasks by query
   */
  searchTasks: async (query) => {
    try {
      const response = await apiClient.get(`/tasks/search?q=${encodeURIComponent(query)}`);
      return response.data.map(transformTaskDates);
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  },

  /**
   * Get tasks by category
   */
  getTasksByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/tasks/category/${encodeURIComponent(category)}`);
      return response.data.map(transformTaskDates);
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
      throw error;
    }
  },

  /**
   * Get tasks by priority
   */
  getTasksByPriority: async (priority) => {
    try {
      const response = await apiClient.get(`/tasks/priority/${priority}`);
      return response.data.map(transformTaskDates);
    } catch (error) {
      console.error('Error fetching tasks by priority:', error);
      throw error;
    }
  }
};

export default todoApi;
