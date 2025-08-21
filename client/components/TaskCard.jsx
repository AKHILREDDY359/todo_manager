import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import SubtaskList from './SubtaskList.jsx';
import './TaskCard.css';

/**
 * TaskCard Component
 * Features:
 * - Display task information with priority indicators
 * - Checkbox for completion toggle
 * - Edit and delete actions
 * - Expandable subtasks
 * - Tag display
 * - Due date formatting
 * - Drag and drop support
 * - Responsive design
 */
const TaskCard = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  isDragging = false,
  dragHandleProps = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Format due date
  const formatDueDate = (date) => {
    if (!date) return null;

    const now = new Date();
    const dueDate = new Date(date);

    // Check if the date is valid
    if (isNaN(dueDate.getTime())) {
      console.warn('Invalid date value:', date);
      return { text: 'Invalid date', status: 'error' };
    }

    const diffInDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return { text: `Overdue by ${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''}`, status: 'overdue' };
    } else if (diffInDays === 0) {
      return { text: 'Due today', status: 'today' };
    } else if (diffInDays === 1) {
      return { text: 'Due tomorrow', status: 'tomorrow' };
    } else if (diffInDays <= 7) {
      return { text: `Due in ${diffInDays} days`, status: 'soon' };
    } else {
      return { text: format(dueDate, 'MMM dd, yyyy'), status: 'later' };
    }
  };

  // Get priority class
  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  // Calculate subtask completion
  const subtaskStats = {
    total: task.subtasks?.length || 0,
    completed: task.subtasks?.filter(subtask => subtask.completed).length || 0
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div 
      className={`task-card ${task.completed ? 'completed' : ''} ${getPriorityClass()} ${isDragging ? 'dragging' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drag Handle */}
      <div className="drag-handle" {...dragHandleProps}>
        ⋮⋮
      </div>

      {/* Priority Indicator */}
      {task.priority && (
        <div className={`priority-indicator ${task.priority}`}>
          {task.priority === 'high' && '🔴'}
          {task.priority === 'medium' && '🟡'}
          {task.priority === 'low' && '🟢'}
        </div>
      )}

      {/* Main Content */}
      <div className="task-content">
        {/* Header Row */}
        <div className="task-header">
          <div className="task-left">
            {/* Completion Checkbox */}
            <button
              className={`task-checkbox ${task.completed ? 'checked' : ''}`}
              onClick={() => onToggleComplete(task.id)}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && <span className="checkmark">✓</span>}
            </button>

            {/* Task Title */}
            <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </h3>
          </div>

          {/* Actions */}
          <div className={`task-actions ${showActions ? 'visible' : ''}`}>
            <button
              className="action-btn edit-btn"
              onClick={() => onEdit(task)}
              aria-label="Edit task"
              title="Edit task"
            >
              ✏️
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
              title="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {/* Metadata Row */}
        <div className="task-metadata">
          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span key={index} className="task-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Category */}
          {task.category && (
            <span className="task-category">
              📁 {task.category}
            </span>
          )}

          {/* Due Date */}
          {dueInfo && (
            <span className={`task-due-date ${dueInfo.status}`}>
              📅 {dueInfo.text}
            </span>
          )}
        </div>

        {/* Subtasks Summary */}
        {subtaskStats.total > 0 && (
          <div className="subtasks-summary">
            <button
              className="subtasks-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              <span className="subtasks-icon">
                {isExpanded ? '📂' : '📁'}
              </span>
              <span className="subtasks-text">
                {subtaskStats.completed}/{subtaskStats.total} subtasks completed
              </span>
              <span className="expand-icon">
                {isExpanded ? '▲' : '▼'}
              </span>
            </button>

            {/* Progress Bar */}
            <div className="subtasks-progress">
              <div 
                className="progress-bar"
                style={{ 
                  width: subtaskStats.total > 0 
                    ? `${(subtaskStats.completed / subtaskStats.total) * 100}%` 
                    : '0%' 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Expandable Subtasks */}
        {isExpanded && task.subtasks && task.subtasks.length > 0 && (
          <div className="subtasks-container">
            <SubtaskList
              subtasks={task.subtasks}
              taskId={task.id}
              onAdd={onAddSubtask}
              onUpdate={onUpdateSubtask}
              onDelete={onDeleteSubtask}
            />
          </div>
        )}

        {/* Add Subtask Button */}
        {isExpanded && (
          <button
            className="add-subtask-btn"
            onClick={() => onAddSubtask && onAddSubtask(task.id)}
          >
            ➕ Add Subtask
          </button>
        )}
      </div>

      {/* Created Date (Footer) */}
      <div className="task-footer">
        <span className="task-created">
          Created {format(task.createdAt, 'MMM dd, yyyy')}
        </span>
        {task.updatedAt && task.updatedAt > task.createdAt && (
          <span className="task-updated">
            • Updated {format(task.updatedAt, 'MMM dd, yyyy')}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
