import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

/**
 * SearchBar Component
 * Features:
 * - Real-time search with debouncing
 * - Search suggestions
 * - Keyboard navigation
 * - Clear search functionality
 * - Responsive design
 * - Accessibility support
 */
const SearchBar = ({ 
  value = '', 
  onChange, 
  placeholder = 'Search tasks...', 
  suggestions = [],
  onSuggestionSelect,
  debounceMs = 300 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [localValue, setLocalValue] = useState(value);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localValue, onChange, value, debounceMs]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    if (localValue.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Escape') {
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        } else if (localValue.trim()) {
          // Submit current search
          onChange?.(localValue);
          inputRef.current?.blur();
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;

      case 'Tab':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;

      default:
        break;
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    const suggestionValue = typeof suggestion === 'string' ? suggestion : suggestion.value;
    setLocalValue(suggestionValue);
    onChange?.(suggestionValue);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Clear search
  const clearSearch = () => {
    setLocalValue('');
    onChange?.('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  // Filter suggestions based on current input
  const filteredSuggestions = suggestions.filter(suggestion => {
    const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.label;
    return suggestionText.toLowerCase().includes(localValue.toLowerCase());
  }).slice(0, 5); // Limit to 5 suggestions

  return (
    <div className="search-bar-container">
      <div className={`search-bar ${isFocused ? 'focused' : ''} ${localValue ? 'has-value' : ''}`}>
        {/* Search Icon */}
        <div className="search-icon">
          <Search size={18} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search tasks"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          role="combobox"
        />

        {/* Clear Button */}
        {localValue && (
          <button
            type="button"
            className="clear-btn"
            onClick={clearSearch}
            aria-label="Clear search"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

      </div>

      {/* Search Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="suggestions-dropdown"
          role="listbox"
          aria-label="Search suggestions"
        >
          {filteredSuggestions.map((suggestion, index) => {
            const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.label;
            const suggestionIcon = typeof suggestion === 'object' ? suggestion.icon : null;
            
            return (
              <button
                key={index}
                type="button"
                className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                onClick={() => selectSuggestion(suggestion)}
                role="option"
                aria-selected={index === selectedSuggestionIndex}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
              >
                {suggestionIcon && (
                  <span className="suggestion-icon">{suggestionIcon}</span>
                )}
                <span className="suggestion-text">{suggestionText}</span>
                {typeof suggestion === 'object' && suggestion.type && (
                  <span className="suggestion-type">{suggestion.type}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Search Shortcuts Hint */}
      {isFocused && !showSuggestions && (
        <div className="search-hints">
          <div className="hint-item">
            <kbd>↵</kbd> Search
          </div>
          <div className="hint-item">
            <kbd>Esc</kbd> Close
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
