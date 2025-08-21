import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Folder, Plus } from 'lucide-react';
import TaskList from '../components/TaskList.jsx';
import TaskForm from '../components/TaskForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import todoApi from '../services/todoApi.js';
import './Category.css';

/**
 * Category Page Component
 * Features:
 * - Display tasks filtered by category
 * - Dynamic routing with category name
 * - Add new tasks to the category
 * - Category statistics
 */
const Category = () => {
  const { categoryName } = useParams();
  const decodedCategoryName = decodeURIComponent(categoryName);
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Load tasks for this category
  useEffect(() => {
    loadCategoryTasks();
  }, [categoryName]);

  const loadCategoryTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all tasks and filter by category
      const allTasks = await todoApi.getTasks();
      const categoryTasks = allTasks.filter(task => 
        task.category === decodedCategoryName
      );
      setTasks(categoryTasks);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      // Ensure the new task has the current category
      const newTaskData = {
        ...taskData,
        category: decodedCategoryName
      };
      
      const newTask = await todoApi.createTask(newTaskData);
      setTasks(prev => [newTask, ...prev]);
      setShowTaskForm(false);
    } catch (err) {
      setError(err);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = await todoApi.updateTask(taskId, { 
        completed: !task.completed 
      });
      
      setTasks(prev => prev.map(t => 
        t.id === taskId ? updatedTask : t
      ));
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await todoApi.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err);
    }
  };

  const handleEditTask = (task) => {
    // Navigate to task detail page for editing
    window.open(`/task/${task.id}`, '_blank');
  };

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    highPriority: tasks.filter(task => task.priority === 'high' && !task.completed).length
  };

  const getCategoryColor = (categoryName) => {
    // Generate a consistent color based on category name
    const colors = [
      'var(--primary-color)',
      'var(--secondary-color)', 
      'var(--teal-color)',
      'var(--accent-color)',
      'var(--success-color)',
      'var(--warning-color)'
    ];
    
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="category-container">
        <LoadingSpinner size="large" message="Loading category tasks..." />
      </div>
    );
  }

  return (
    <div className="category-container">
      {/* Header */}
      <header className="category-header">
        <div className="header-navigation">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to All Tasks
          </Link>
        </div>

        <div className="category-info">
          <div className="category-icon" style={{ backgroundColor: getCategoryColor(decodedCategoryName) }}>
            <Folder size={32} />
          </div>
          <div className="category-details">
            <h1 className="category-title">{decodedCategoryName}</h1>
            <p className="category-subtitle">
              {stats.total} task{stats.total !== 1 ? 's' : ''} in this category
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowTaskForm(true)}
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </header>

      {/* Statistics */}
      <div className="category-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card high-priority">
          <span className="stat-number">{stats.highPriority}</span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>

      {/* Content */}
      <div className="category-content">
        {error && (
          <ErrorMessage
            message={error.message}
            onRetry={loadCategoryTasks}
          />
        )}

        {tasks.length === 0 && !loading && !error ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <Folder size={64} style={{ color: getCategoryColor(decodedCategoryName) }} />
              <h3>No tasks in {decodedCategoryName}</h3>
              <p>Create your first task in this category to get started!</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowTaskForm(true)}
              >
                <Plus size={16} />
                Add First Task
              </button>
            </div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            loading={loading}
          />
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="modal-overlay" onClick={() => setShowTaskForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <TaskForm
              task={{ category: decodedCategoryName }} // Pre-fill category
              onSubmit={handleAddTask}
              onCancel={() => setShowTaskForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
