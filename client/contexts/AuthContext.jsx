import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages authentication state and operations
 * Features:
 * - User authentication state management
 * - Sign in/sign up/sign out operations
 * - Protected route handling
 * - Persistent sessions with localStorage
 * - Ready for backend integration
 */

const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions (replace with real backend calls)
const authAPI = {
  signIn: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'demo@taskflow.com' && password === 'demo123') {
      return {
        id: '1',
        email: 'demo@taskflow.com',
        name: 'Demo User',
        avatar: null,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true
        }
      };
    }
    
    // Check if user exists in localStorage (for demo)
    const users = JSON.parse(localStorage.getItem('taskflow-users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    throw new Error('Invalid email or password');
  },

  signUp: async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { email, password, name } = userData;
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('taskflow-users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed on backend
      name,
      avatar: null,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true
      }
    };
    
    // Save to localStorage (in real app, this would be backend)
    users.push(newUser);
    localStorage.setItem('taskflow-users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  signOut: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  updateProfile: async (userId, updates) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('taskflow-users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('taskflow-users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = users[userIndex];
      return userWithoutPassword;
    }
    
    throw new Error('User not found');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('taskflow-auth-user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('taskflow-auth-user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authAPI.signIn(email, password);
      setUser(userData);
      localStorage.setItem('taskflow-auth-user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await authAPI.signUp(userData);
      setUser(newUser);
      localStorage.setItem('taskflow-auth-user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    
    try {
      await authAPI.signOut();
      setUser(null);
      localStorage.removeItem('taskflow-auth-user');
      // Also clear tasks data on sign out
      localStorage.removeItem('taskflow-tasks');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authAPI.updateProfile(user.id, updates);
      setUser(updatedUser);
      localStorage.setItem('taskflow-auth-user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Auth context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
