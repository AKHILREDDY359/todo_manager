import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Tag, User, Clock } from 'lucide-react';
import todoApi from '../services/todoApi.js';
import TaskForm from '../components/TaskForm.jsx';
import SubtaskList from '../components/SubtaskList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { format } from 'date-fns';
import './TaskDetail.css';

/**
 * TaskDetail Page Component
 * Features:
 * - Display complete task information
 * - Edit task inline or in modal
 * - Manage subtasks
 * - Show task history and metadata
 * - Dynamic routing with task ID
 */
const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load task details
  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be todoApi.getTask(id)
      // For demo, we'll get all tasks and find the one with matching ID
      const tasks = await todoApi.getTasks();
      const foundTask = tasks.find(t => t.id === id);
      
      if (foundTask) {
        setTask(foundTask);
      } else {
        setError(new Error('Task not found'));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await todoApi.updateTask(id, taskData);
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await todoApi.deleteTask(id);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err);
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      const updatedTask = await todoApi.updateTask(id, { 
        completed: !task.completed 
      });
      setTask(updatedTask);
    } catch (err) {
      setError(err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger-color)';
      case 'medium': return 'var(--warning-color)';
      case 'low': return 'var(--success-color)';
      default: return 'var(--secondary-color)';
    }
  };

  if (loading) {
    return (
      <div className="task-detail-container">
        <LoadingSpinner size="large" message="Loading task details..." />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="task-detail-container">
        <ErrorMessage 
          message={error?.message || 'Task not found'} 
          onRetry={loadTask}
        />
        <div className="task-detail-actions">
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail-container">
      {/* Header */}
      <header className="task-detail-header">
        <div className="header-navigation">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Tasks
          </Link>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(true)}
            disabled={isDeleting}
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            className={`btn btn-danger ${isDeleting ? 'loading' : ''}`}
            onClick={handleDeleteTask}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </header>

      {/* Task Content */}
      <div className="task-detail-content">
        <div className="task-main">
          {/* Task Title and Status */}
          <div className="task-title-section">
            <div className="task-status">
              <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={handleToggleComplete}
              >
                {task.completed && <span className="checkmark">✓</span>}
              </button>
            </div>
            <h1 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </h1>
          </div>

          {/* Task Description */}
          {task.description && (
            <div className="task-description">
              <p>{task.description}</p>
            </div>
          )}

          {/* Task Metadata */}
          <div className="task-metadata">
            <div className="metadata-grid">
              <div className="metadata-item">
                <Tag size={16} />
                <span className="metadata-label">Priority</span>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </div>

              {task.category && (
                <div className="metadata-item">
                  <User size={16} />
                  <span className="metadata-label">Category</span>
                  <Link to={`/category/${encodeURIComponent(task.category)}`} className="category-link">
                    {task.category}
                  </Link>
                </div>
              )}

              {task.dueDate && (
                <div className="metadata-item">
                  <Calendar size={16} />
                  <span className="metadata-label">Due Date</span>
                  <span className="due-date">
                    {format(task.dueDate, 'MMM dd, yyyy')}
                  </span>
                </div>
              )}

              <div className="metadata-item">
                <Clock size={16} />
                <span className="metadata-label">Created</span>
                <span className="created-date">
                  {format(task.createdAt, 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="task-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {task.tags.map(tag => (
                  <Link 
                    key={tag} 
                    to={`/tag/${encodeURIComponent(tag)}`}
                    className="tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="task-subtasks">
              <h3>Subtasks</h3>
              <SubtaskList
                subtasks={task.subtasks}
                taskId={task.id}
                onAdd={(taskId, title) => {
                  // Handle add subtask
                  console.log('Add subtask:', title);
                }}
                onUpdate={(taskId, subtaskId, data) => {
                  // Handle update subtask
                  console.log('Update subtask:', subtaskId, data);
                }}
                onDelete={(taskId, subtaskId) => {
                  // Handle delete subtask
                  console.log('Delete subtask:', subtaskId);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <TaskForm
              task={task}
              onSubmit={handleUpdateTask}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
