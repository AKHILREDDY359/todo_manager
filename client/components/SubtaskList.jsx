import React, { useState } from 'react';
import './SubtaskList.css';

/**
 * SubtaskList Component
 * Features:
 * - Display list of subtasks
 * - Add new subtasks
 * - Toggle subtask completion
 * - Edit subtask titles
 * - Delete subtasks
 * - Responsive design
 */
const SubtaskList = ({ 
  subtasks = [], 
  taskId, 
  onAdd, 
  onUpdate, 
  onDelete 
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Handle adding new subtask
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim() && onAdd) {
      onAdd(taskId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  // Handle subtask completion toggle
  const handleToggleComplete = (subtaskId, completed) => {
    if (onUpdate) {
      onUpdate(taskId, subtaskId, { completed: !completed });
    }
  };

  // Start editing subtask
  const startEditing = (subtask) => {
    setEditingId(subtask.id);
    setEditTitle(subtask.title);
  };

  // Save edited subtask
  const saveEdit = (subtaskId) => {
    if (editTitle.trim() && onUpdate) {
      onUpdate(taskId, subtaskId, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle('');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  // Handle delete subtask
  const handleDelete = (subtaskId) => {
    if (onDelete && window.confirm('Delete this subtask?')) {
      onDelete(taskId, subtaskId);
    }
  };

  return (
    <div className="subtask-list">
      {/* Existing Subtasks */}
      {subtasks.length > 0 && (
        <div className="subtasks">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
              {/* Completion Checkbox */}
              <button
                className={`subtask-checkbox ${subtask.completed ? 'checked' : ''}`}
                onClick={() => handleToggleComplete(subtask.id, subtask.completed)}
                aria-label={subtask.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {subtask.completed && <span className="checkmark">✓</span>}
              </button>

              {/* Subtask Title */}
              {editingId === subtask.id ? (
                <div className="subtask-edit">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(subtask.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="subtask-edit-input"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveEdit(subtask.id)}
                      className="save-btn"
                      title="Save"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="cancel-btn"
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span 
                    className={`subtask-title ${subtask.completed ? 'completed' : ''}`}
                    onDoubleClick={() => startEditing(subtask)}
                  >
                    {subtask.title}
                  </span>
                  
                  {/* Subtask Actions */}
                  <div className="subtask-actions">
                    <button
                      onClick={() => startEditing(subtask)}
                      className="action-btn edit-btn"
                      title="Edit subtask"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(subtask.id)}
                      className="action-btn delete-btn"
                      title="Delete subtask"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Subtask Form */}
      <form onSubmit={handleAddSubtask} className="add-subtask-form">
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add a subtask..."
          className="add-subtask-input"
        />
        <button
          type="submit"
          className="add-subtask-btn"
          disabled={!newSubtaskTitle.trim()}
        >
          ➕
        </button>
      </form>
    </div>
  );
};

export default SubtaskList;
