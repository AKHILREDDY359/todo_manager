import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import DateTasks from './pages/DateTasks.jsx';
import NotFound from './pages/NotFound.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './styles/main.css';
import './styles/animations.css';
import './global.css';

/**
 * Main App component with routing setup
 * Features:
 * - React Router for navigation between pages
 * - Theme context for dark/light mode
 * - Global navigation bar
 * - Error boundary for 404 pages
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="main-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Home page serves as the main Todo Manager */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Test simple route first */}
              <Route path="/test" element={<div style={{padding: '100px', textAlign: 'center'}}><h1>Test Route Works!</h1></div>} />

              {/* Date-specific tasks view */}
              <Route path="/date/:date" element={<DateTasks />} />

              {/* Catch-all route for 404 errors */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
