import React, { useState } from 'react';
import { Calendar, Type, Zap, Clock, ClipboardList, CheckCircle, Circle, Tag, Sliders, X, ArrowUp, ArrowDown, Folder, AlertTriangle } from 'lucide-react';
import './FilterBar.css';

/**
 * FilterBar Component
 * Features:
 * - Task filtering by status, priority, category
 * - Task sorting options
 * - View mode toggle (list/grid)
 * - Clear filters functionality
 * - Responsive design
 */
const FilterBar = ({
  filters = {},
  sortConfig = {},
  selectedCategory = 'all',
  onFiltersChange,
  onSortChange,
  onCategoryChange,
  tasks = [],
  viewMode = 'list',
  onViewModeChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique categories and tags from tasks
  const getUniqueValues = (field) => {
    const values = new Set();
    tasks.forEach(task => {
      if (field === 'tags' && task.tags) {
        task.tags.forEach(tag => values.add(tag));
      } else if (task[field]) {
        values.add(task[field]);
      }
    });
    return Array.from(values).sort();
  };

  const categories = getUniqueValues('category');
  const availableTags = getUniqueValues('tags');

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value === 'all' ? '' : value
    };
    onFiltersChange?.(newFilters);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    const newDirection = 
      sortConfig.field === field && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    onSortChange?.({
      field,
      direction: newDirection
    });
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    onCategoryChange?.(category);
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange?.({});
    onCategoryChange?.('all');
    onSortChange?.({ field: 'createdAt', direction: 'desc' });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      selectedCategory !== 'all' ||
      Object.values(filters).some(value => value && value !== '')
    );
  };

  // Sort options
  const sortOptions = [
    { field: 'createdAt', label: 'Date Created', icon: Calendar },
    { field: 'title', label: 'Title', icon: Type },
    { field: 'priority', label: 'Priority', icon: Zap },
    { field: 'dueDate', label: 'Due Date', icon: Clock }
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: ClipboardList },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'pending', label: 'Pending', icon: Circle }
  ];

  // Priority options
  const priorityOptions = [
    { value: 'all', label: 'All Priorities', icon: Tag },
    { value: 'high', label: 'High Priority', icon: AlertTriangle },
    { value: 'medium', label: 'Medium Priority', icon: Circle },
    { value: 'low', label: 'Low Priority', icon: Circle }
  ];

  return (
    <div className="filter-bar">
      {/* Main Filter Row */}
      <div className="filter-row main-filters">
        {/* Quick Category Filters */}
        <div className="filter-group category-filters">
          <div className="filter-chips">
            <button
              className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              <ClipboardList size={16} className="inline mr-1" />
              All
            </button>
            <button
              className={`filter-chip ${selectedCategory === 'pending' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('pending')}
            >
              <Circle size={16} className="inline mr-1" />
              Pending
            </button>
            <button
              className={`filter-chip ${selectedCategory === 'completed' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('completed')}
            >
              <CheckCircle size={16} className="inline mr-1" />
              Completed
            </button>
            <button
              className={`filter-chip ${selectedCategory === 'high-priority' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('high-priority')}
            >
              <Zap size={16} className="inline mr-1" />
              High Priority
            </button>
          </div>
        </div>

        {/* Sort and View Controls */}
        <div className="filter-group controls">
          {/* Sort Dropdown */}
          <div className="sort-control">
            <label className="control-label">Sort by:</label>
            <select
              value={sortConfig.field || 'createdAt'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.field} value={option.field}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className={`sort-direction ${sortConfig.direction === 'desc' ? 'desc' : 'asc'}`}
              onClick={() => handleSortChange(sortConfig.field || 'createdAt')}
              title={`Sort ${sortConfig.direction === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortConfig.direction === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
            </button>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Sliders size={16} className="inline mr-1" />
            Filters
          </button>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <button
              className="clear-filters"
              onClick={clearAllFilters}
              title="Clear all filters"
            >
              <X size={16} className="inline mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="filter-row advanced-filters">
          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="filter-group">
            <label className="filter-label">Priority:</label>
            <select
              value={filters.priority || 'all'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="filter-select"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div className="filter-group tags-filter">
              <label className="filter-label">Tags:</label>
              <div className="tags-list">
                {availableTags.slice(0, 6).map(tag => (
                  <button
                    key={tag}
                    className={`tag-chip ${
                      filters.tags?.includes(tag) ? 'active' : ''
                    }`}
                    onClick={() => {
                      const currentTags = filters.tags || [];
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter(t => t !== tag)
                        : [...currentTags, tag];
                      handleFilterChange('tags', newTags);
                    }}
                  >
                    <Tag size={14} className="inline mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
