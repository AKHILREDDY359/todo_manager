import { useState, useEffect, useCallback } from 'react';
import todoApi from '../services/todoApi.js';

/**
 * Custom hook for managing todo state and operations
 * Features:
 * - State management for tasks, loading, and errors
 * - CRUD operations for tasks and subtasks
 * - Search and filtering functionality
 * - Local state with API integration
 * - Error handling and loading states
 */
export const useTodoManager = () => {
  // Core state
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all', // all, completed, pending
    priority: '', // low, medium, high
    category: '',
    tags: []
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    direction: 'desc'
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Load tasks from API
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const tasksData = await todoApi.getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError(err);
      console.error('Error loading tasks:', err);
      
      // Load from localStorage as fallback
      const localTasks = localStorage.getItem('taskflow-tasks');
      if (localTasks) {
        try {
          const parsedTasks = JSON.parse(localTasks);
          setTasks(parsedTasks.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : null
          })));
        } catch (parseError) {
          console.error('Error parsing local tasks:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage as backup
  const saveToLocalStorage = useCallback((tasksToSave) => {
    try {
      localStorage.setItem('taskflow-tasks', JSON.stringify(tasksToSave));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, []);

  // Add new task
  const addTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const newTask = {
      id: tempId,
      ...taskData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [],
      order: tasks.length
    };

    // Optimistic update
    setTasks(prev => [newTask, ...prev]);

    try {
      const createdTask = await todoApi.createTask(taskData);
      setTasks(prev => prev.map(task =>
        task.id === tempId ? createdTask : task
      ));
      saveToLocalStorage([createdTask, ...tasks]);
    } catch (err) {
      // Check if we got a valid task back from the fallback
      const createdTask = await todoApi.createTask(taskData);
      if (createdTask) {
        // Fallback worked, update with the mock task
        setTasks(prev => prev.map(task =>
          task.id === tempId ? createdTask : task
        ));
        console.log('Using fallback mock task due to API error:', err.message);
      } else {
        // Revert optimistic update only if fallback also failed
        setTasks(prev => prev.filter(task => task.id !== tempId));
        setError(err);
        console.error('Task creation failed completely:', err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [tasks, saveToLocalStorage]);

  // Update existing task
  const updateTask = useCallback(async (taskId, updateData) => {
    setLoading(true);
    setError(null);

    // Store original task for rollback
    const originalTask = tasks.find(task => task.id === taskId);
    
    // Optimistic update
    const updatedTask = {
      ...originalTask,
      ...updateData,
      updatedAt: new Date()
    };
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? updatedTask : task
    ));

    try {
      const savedTask = await todoApi.updateTask(taskId, updateData);
      setTasks(prev => prev.map(task =>
        task.id === taskId ? savedTask : task
      ));
      saveToLocalStorage(tasks.map(task =>
        task.id === taskId ? savedTask : task
      ));
    } catch (err) {
      // Try fallback approach - keep the optimistic update since todoApi has fallback
      console.log('Using optimistic update due to API error:', err.message);
      // Keep the optimistically updated task instead of reverting
      saveToLocalStorage(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } finally {
      setLoading(false);
    }
  }, [tasks, saveToLocalStorage]);

  // Delete task
  const deleteTask = useCallback(async (taskId) => {
    setLoading(true);
    setError(null);

    // Store original tasks for rollback
    const originalTasks = [...tasks];
    
    // Optimistic update
    setTasks(prev => prev.filter(task => task.id !== taskId));

    try {
      await todoApi.deleteTask(taskId);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      saveToLocalStorage(updatedTasks);
    } catch (err) {
      // Revert optimistic update
      setTasks(originalTasks);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tasks, saveToLocalStorage]);

  // Toggle task completion
  const toggleTaskComplete = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await updateTask(taskId, { completed: !task.completed });
  }, [tasks, updateTask]);

  // Reorder tasks (for drag and drop)
  const reorderTasks = useCallback(async (newTaskOrder) => {
    setLoading(true);
    setError(null);

    // Store original order for rollback
    const originalTasks = [...tasks];
    
    // Optimistic update
    setTasks(newTaskOrder);

    try {
      const taskIds = newTaskOrder.map(task => task.id);
      const reorderedTasks = await todoApi.reorderTasks(taskIds);
      setTasks(reorderedTasks);
      saveToLocalStorage(reorderedTasks);
    } catch (err) {
      // Revert optimistic update
      setTasks(originalTasks);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tasks, saveToLocalStorage]);

  // Add subtask
  const addSubtask = useCallback(async (taskId, subtaskTitle) => {
    setLoading(true);
    setError(null);

    try {
      const newSubtask = await todoApi.addSubtask(taskId, { title: subtaskTitle });
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      ));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update subtask
  const updateSubtask = useCallback(async (taskId, subtaskId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedSubtask = await todoApi.updateSubtask(taskId, subtaskId, updateData);
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task, 
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId ? updatedSubtask : subtask
              )
            }
          : task
      ));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete subtask
  const deleteSubtask = useCallback(async (taskId, subtaskId) => {
    setLoading(true);
    setError(null);

    try {
      await todoApi.deleteSubtask(taskId, subtaskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task, 
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
            }
          : task
      ));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh tasks (for error recovery)
  const refreshTasks = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get filtered and sorted tasks
  const getFilteredTasks = useCallback(() => {
    let filteredTasks = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        if (filters.status === 'completed') return task.completed;
        if (filters.status === 'pending') return !task.completed;
        return true;
      });
    }

    // Apply priority filter
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    // Apply category filter
    if (filters.category) {
      filteredTasks = filteredTasks.filter(task => task.category === filters.category);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        filters.tags.some(tag => task.tags.includes(tag))
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      // Handle date sorting
      if (sortConfig.field === 'dueDate' || sortConfig.field === 'createdAt') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      // Handle priority sorting
      if (sortConfig.field === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[aValue] || 0;
        bValue = priorityOrder[bValue] || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filteredTasks;
  }, [tasks, searchQuery, filters, sortConfig]);

  return {
    // State
    tasks,
    loading,
    error,
    searchQuery,
    filters,
    sortConfig,

    // Actions
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    reorderTasks,
    addSubtask,
    updateSubtask,
    deleteSubtask,

    // Utilities
    refreshTasks,
    clearError,
    getFilteredTasks,

    // Setters
    setSearchQuery,
    setFilters,
    setSortConfig
  };
};
