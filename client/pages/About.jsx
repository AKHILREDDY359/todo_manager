import React, { useState, useEffect } from 'react';
import { CheckCircle, Tag, Search, Moon, Smartphone, RefreshCw, Users, TrendingUp, Clock } from 'lucide-react';
import './About.css';

/**
 * About Page Component
 * Features:
 * - Information about the Todo Manager application
 * - Feature highlights and benefits
 * - Technology stack information
 * - Responsive design
 */
const About = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Create, edit, delete, and organize your tasks with ease. Support for subtasks and categories.'
    },
    {
      icon: Tag,
      title: 'Tags & Priorities',
      description: 'Organize tasks with custom tags and set priorities to focus on what matters most.'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Quickly find tasks with powerful search and filtering capabilities.'
    },
    {
      icon: Moon,
      title: 'Dynamic Themes',
      description: 'Auto-changing color themes and dark mode for optimal focus and productivity.'
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Works perfectly on desktop, tablet, and mobile devices with touch-friendly interactions.'
    },
    {
      icon: RefreshCw,
      title: 'Smart Organization',
      description: 'Intelligent task categorization with special Study mode for students.'
    }
  ];

  const techStack = [
    { name: 'React 18', description: 'Modern frontend library with hooks and functional components' },
    { name: 'Vite', description: 'Fast build tool and development server' },
    { name: 'React Router', description: 'Client-side routing for single page application' },
    { name: 'Axios', description: 'HTTP client for API communication' },
    { name: 'CSS3', description: 'Modern styling with custom properties and animations' },
    { name: 'Spring Boot Ready', description: 'Designed to integrate with Spring Boot backend' }
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">About TaskFlow</h1>
            <p className="hero-subtitle">
              A modern, intuitive task management application designed to help you stay organized 
              and productive. Built with the latest web technologies for the best user experience.
            </p>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="task-card-demo">
                <div className="task-item completed">
                  <span className="check-icon">✅</span>
                  <span>Build awesome todo app</span>
                </div>
                <div className="task-item">
                  <span className="check-icon">⭕</span>
                  <span>Add more features</span>
                </div>
                <div className="task-item high-priority">
                  <span className="check-icon">⭕</span>
                  <span>Deploy to production</span>
                  <span className="priority-badge">High</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to manage your tasks efficiently and stay productive.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={48} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="tech-section">
          <div className="section-header">
            <h2 className="section-title">Built with Modern Technology</h2>
            <p className="section-subtitle">
              Leveraging the latest tools and frameworks for optimal performance and maintainability.
            </p>
          </div>
          
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-item">
                <h4 className="tech-name">{tech.name}</h4>
                <p className="tech-description">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <div className="mission-text">
              <p>
                TaskFlow was created with the belief that productivity tools should be simple, 
                intuitive, and powerful. We understand that everyone has different ways of organizing 
                their work, so we've built a flexible system that adapts to your workflow.
              </p>
              <p>
                Whether you're managing personal tasks, coordinating team projects, or planning 
                long-term goals, TaskFlow provides the tools you need without the complexity 
                you don't want.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who have transformed their productivity with TaskFlow.</p>
            <div className="cta-buttons">
              <a href="/" className="btn btn-primary">
                Start Managing Tasks
              </a>
              <a href="/contact" className="btn btn-secondary">
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
