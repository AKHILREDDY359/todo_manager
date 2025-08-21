import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Home from './Home.jsx';

// Import global styles
import '../global.css';

/**
 * Main Todo Manager Application
 * Features the complete task management interface
 */
export default function Index() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Home />
      </div>
    </ThemeProvider>
  );
}
