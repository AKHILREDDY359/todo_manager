import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Dynamic Theme Context for automatic color changing
 * Features:
 * - Auto-changing color schemes
 * - Time-based theme switching
 * - Student-friendly study mode colors
 * - Performance-based color adjustments
 */

const DynamicThemeContext = createContext();

export const useDynamicTheme = () => {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error('useDynamicTheme must be used within a DynamicThemeProvider');
  }
  return context;
};

const colorThemes = {
  focus: {
    name: 'Focus Mode',
    primary: '#6366f1',
    secondary: '#06b6d4',
    accent: '#8b5cf6',
    teal: '#0d9488',
    description: 'Calm blues and purples for concentration'
  },
  energy: {
    name: 'Energy Mode',
    primary: '#ec4899',
    secondary: '#f59e0b',
    accent: '#ef4444',
    teal: '#10b981',
    description: 'Vibrant colors to boost motivation'
  },
  nature: {
    name: 'Nature Mode',
    primary: '#10b981',
    secondary: '#0d9488',
    accent: '#059669',
    teal: '#047857',
    description: 'Earthy greens for a natural feel'
  },
  sunset: {
    name: 'Sunset Mode',
    primary: '#f59e0b',
    secondary: '#ec4899',
    accent: '#ef4444',
    teal: '#06b6d4',
    description: 'Warm sunset colors for evening sessions'
  },
  ocean: {
    name: 'Ocean Mode',
    primary: '#06b6d4',
    secondary: '#0ea5e9',
    accent: '#0284c7',
    teal: '#0891b2',
    description: 'Cool ocean blues for tranquility'
  },
  study: {
    name: 'Study Mode',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#7c3aed',
    teal: '#6d28d9',
    description: 'Purple tones to enhance learning'
  }
};

export const DynamicThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('focus');
  const [autoChange, setAutoChange] = useState(true);
  const [changeInterval, setChangeInterval] = useState(30000); // 30 seconds

  // Auto-change theme based on time or user activity
  useEffect(() => {
    if (!autoChange) return;

    const interval = setInterval(() => {
      const themes = Object.keys(colorThemes);
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setCurrentTheme(themes[nextIndex]);
    }, changeInterval);

    return () => clearInterval(interval);
  }, [autoChange, changeInterval, currentTheme]);

  // Apply theme colors to CSS variables
  useEffect(() => {
    const theme = colorThemes[currentTheme];
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--teal-color', theme.teal);
    
    // Add gradient background based on current theme
    const gradientColors = [theme.primary, theme.secondary, theme.accent];
    root.style.setProperty('--dynamic-gradient', 
      `linear-gradient(135deg, ${gradientColors[0]}20 0%, ${gradientColors[1]}10 50%, ${gradientColors[2]}20 100%)`
    );

    // Store current theme
    localStorage.setItem('dynamic-theme', currentTheme);
  }, [currentTheme]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('dynamic-theme');
    if (savedTheme && colorThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (colorThemes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleAutoChange = () => {
    setAutoChange(!autoChange);
  };

  const setStudyMode = () => {
    setCurrentTheme('study');
    setAutoChange(false);
  };

  const setFocusMode = () => {
    setCurrentTheme('focus');
    setAutoChange(false);
  };

  const getThemeForCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'study':
      case 'learning':
      case 'education':
        return 'study';
      case 'work':
      case 'projects':
        return 'focus';
      case 'health':
      case 'personal':
        return 'nature';
      default:
        return currentTheme;
    }
  };

  const value = {
    currentTheme,
    colorThemes,
    autoChange,
    changeInterval,
    changeTheme,
    toggleAutoChange,
    setStudyMode,
    setFocusMode,
    getThemeForCategory,
    setChangeInterval,
    currentThemeData: colorThemes[currentTheme]
  };

  return (
    <DynamicThemeContext.Provider value={value}>
      {children}
    </DynamicThemeContext.Provider>
  );
};
