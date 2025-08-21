import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskList from '../components/TaskList.jsx';
import TaskForm from '../components/TaskForm.jsx';
import FilterBar from '../components/FilterBar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import todoApi from '../services/todoApi.js';
import { useTodoManager } from '../hooks/useTodoManager.js';
import './Home.css';

/**
 * Home Page - Main Todo Manager Interface
 * Features:
 * - Complete task management (CRUD operations)
 * - Real-time search and filtering
 * - Drag and drop task reordering
 * - Responsive design for all devices
 * - Loading states and error handling
 * - Integration with Spring Boot backend
 */
const Home = () => {
  const navigate = useNavigate();

  // Custom hook for todo management logic
  const {
    tasks,
    loading,
    error,
    searchQuery,
    filters,
    sortConfig,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    reorderTasks,
    setSearchQuery,
    setFilters,
    setSortConfig,
    refreshTasks
  } = useTodoManager();

  // Local state for UI interactions
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Statistics calculation
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    high_priority: tasks.filter(task => task.priority === 'high' && !task.completed).length
  };

  // Handle task form submission
  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        await addTask(taskData);
      }
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Close task form
  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Apply search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        switch (selectedCategory) {
          case 'completed':
            return task.completed;
          case 'pending':
            return !task.completed;
          case 'high-priority':
            return task.priority === 'high' && !task.completed;
          default:
            return task.category === selectedCategory;
        }
      });
    }

    // Apply additional filters
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    if (filters.status && filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => 
        filters.status === 'completed' ? task.completed : !task.completed
      );
    }

    // Apply sorting
    if (sortConfig.field) {
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
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const hasTasksOnDate = (day) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.some(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === dateToCheck.toDateString();
    });
  };

  // Handle calendar date click navigation
  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    setShowCalendar(false); // Close the calendar
    navigate(`/date/${dateString}`);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="home-container">
        <LoadingSpinner message="Loading your tasks..." />
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Header Section */}
        <header className="home-header">
          <div className="header-main">
            <div className="header-top">
              <div className="title-section">
                <h1 className="page-title">My Tasks</h1>
                <p className="page-subtitle">
                  Stay organized and productive with your personal task manager
                </p>
              </div>

              <div className="calendar-widget">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="calendar-toggle"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <Calendar size={20} />
                  <span>Calendar</span>
                </button>

                {/* Test links for debugging */}
                <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                  <a
                    href="/test"
                    style={{
                      padding: '4px 8px',
                      background: '#00ff00',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '10px',
                      color: 'black'
                    }}
                  >
                    Test Simple Route
                  </a>
                  <a
                    href="/date/2025-08-18"
                    style={{
                      padding: '4px 8px',
                      background: '#ffff00',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '10px',
                      color: 'black'
                    }}
                  >
                    Test Date Route
                  </a>
                </div>
              </div>

                {showCalendar && (
                  <div className="mini-calendar">
                    <div className="calendar-header">
                      <button onClick={() => navigateMonth(-1)} className="calendar-nav">
                        <ChevronLeft size={16} />
                      </button>
                      <span className="calendar-month">{getMonthName(currentDate)}</span>
                      <button onClick={() => navigateMonth(1)} className="calendar-nav">
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="calendar-grid">
                      <div className="calendar-weekdays">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="calendar-weekday">{day}</div>
                        ))}
                      </div>

                      <div className="calendar-days">
                        {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => (
                          <div key={`empty-${i}`} className="calendar-day empty"></div>
                        ))}
                        {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                          const day = i + 1;
                          return (
                            <button
                              key={day}
                              className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasTasksOnDate(day) ? 'has-tasks' : ''}`}
                              onClick={() => handleDateClick(day)}
                              type="button"
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Task Statistics */}
          <div className="task-stats">
            <div className="stat-item">
              <span className="stat-number">{taskStats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{taskStats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{taskStats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item high-priority">
              <span className="stat-number">{taskStats.high_priority}</span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>
        </header>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="controls-row">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks, tags, or descriptions..."
            />
            <button
              className="btn btn-primary add-task-btn"
              onClick={() => setShowTaskForm(true)}
            >
              <Plus className="btn-icon" size={16} />
              Add Task
            </button>
          </div>

          <FilterBar
            filters={filters}
            sortConfig={sortConfig}
            selectedCategory={selectedCategory}
            onFiltersChange={setFilters}
            onSortChange={setSortConfig}
            onCategoryChange={setSelectedCategory}
            tasks={tasks}
          />
        </div>

        {/* Error Display */}
        {error && (
          <ErrorMessage
            message={error.message || 'An error occurred'}
            onRetry={refreshTasks}
          />
        )}

        {/* Task List Section */}
        <div className="tasks-section">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              {tasks.length === 0 ? (
                <>
                  <div className="empty-icon">
                    <FileText size={64} />
                  </div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started with organizing your work!</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowTaskForm(true)}
                  >
                    Create Your First Task
                  </button>
                </>
              ) : (
                <>
                  <div className="empty-icon">
                    <Search size={64} />
                  </div>
                  <h3>No tasks found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({});
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={toggleTaskComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onReorder={reorderTasks}
              loading={loading}
            />
          )}
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="modal-overlay" onClick={closeTaskForm}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <TaskForm
                task={editingTask}
                onSubmit={handleTaskSubmit}
                onCancel={closeTaskForm}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* Quick Actions Floating Button (Mobile) */}
        <div className="quick-actions mobile-only">
          <button
            className="fab"
            onClick={() => setShowTaskForm(true)}
            aria-label="Add new task"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
