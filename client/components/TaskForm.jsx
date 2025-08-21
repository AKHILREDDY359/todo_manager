import React, { useState, useEffect } from 'react';
import './TaskForm.css';

/**
 * TaskForm Component
 * Features:
 * - Create new tasks or edit existing ones
 * - Form validation
 * - Priority selection
 * - Tag management
 * - Due date picker
 * - Category selection
 * - Responsive design
 * - Loading states
 */
const TaskForm = ({ task = null, onSubmit, onCancel, loading = false, defaultDueDate = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    tags: [],
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  // Pre-fill form when editing or set default due date
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || '',
        tags: task.tags || [],
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
      });
    } else if (defaultDueDate && !task) {
      // Set default due date for new tasks
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
    }
  }, [task, defaultDueDate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle tag input
  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  // Add tag on Enter or comma
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  // Add tag
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    };

    onSubmit(submitData);
  };

  const isEditing = Boolean(task);
  const priorities = [
    { value: 'low', label: 'Low Priority', icon: '🟢' },
    { value: 'medium', label: 'Medium Priority', icon: '🟡' },
    { value: 'high', label: 'High Priority', icon: '🔴' }
  ];

  const commonCategories = [
    'Study', 'Work', 'Personal', 'Health', 'Finance', 'Learning', 'Projects', 'Home', 'Shopping'
  ];

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2 className="form-title">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button 
          type="button" 
          className="close-btn"
          onClick={onCancel}
          aria-label="Close form"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title..."
            maxLength={100}
            autoFocus
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
          <div className="character-count">
            {formData.title.length}/100
          </div>
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Add more details about this task..."
            rows={3}
            maxLength={500}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
          <div className="character-count">
            {formData.description.length}/500
          </div>
        </div>

        {/* Priority and Due Date Row */}
        <div className="form-row">
          {/* Priority Field */}
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <div className="priority-options">
              {priorities.map(priority => (
                <label key={priority.value} className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleInputChange}
                    className="priority-radio"
                  />
                  <span className="priority-label">
                    <span className="priority-icon">{priority.icon}</span>
                    {priority.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Due Date Field */}
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className={`form-input ${errors.dueDate ? 'error' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <div className="category-container">
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter or select a category..."
              list="categories"
            />
            <datalist id="categories">
              {commonCategories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          <div className="category-suggestions">
            {commonCategories.filter(cat => 
              cat.toLowerCase().includes(formData.category.toLowerCase()) && 
              cat !== formData.category
            ).slice(0, 4).map(category => (
              <button
                key={category}
                type="button"
                className="category-suggestion"
                onClick={() => setFormData(prev => ({ ...prev, category }))}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Field */}
        <div className="form-group">
          <label htmlFor="tags" className="form-label">
            Tags
          </label>
          <div className="tags-container">
            <div className="tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag} tag`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyDown}
                className="tag-input"
                placeholder="Add tags (press Enter or comma)..."
              />
              {tagInput.trim() && (
                <button
                  type="button"
                  className="add-tag-btn"
                  onClick={addTag}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading || !formData.title.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
