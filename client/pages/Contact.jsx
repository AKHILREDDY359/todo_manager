import React, { useState } from 'react';
import './Contact.css';

/**
 * Contact Page Component
 * Features:
 * - Contact form with validation
 * - Contact information display
 * - Social media links
 * - FAQ section
 * - Responsive design
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'hello@taskflow.com',
      link: 'mailto:hello@taskflow.com'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      content: 'Available 24/7',
      link: '#'
    },
    {
      icon: '📱',
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: '📍',
      title: 'Office',
      content: 'San Francisco, CA',
      link: '#'
    }
  ];

  const faqs = [
    {
      question: 'Rich Text Editing & Formatting',
      answer: 'Create beautifully formatted tasks with rich text, markdown support, code blocks, and inline styling options just like Notion.'
    },
    {
      question: 'Database-Style Task Organization',
      answer: 'Organize tasks in database views with custom properties, filters, sorting, and multiple view types (list, board, calendar).'
    },
    {
      question: 'Block-Based Content Structure',
      answer: 'Build tasks with a flexible block system - add text, checklists, images, embeds, and nested content for comprehensive project planning.'
    },
    {
      question: 'Templates & Reusable Components',
      answer: 'Create custom task templates for recurring projects, meeting notes, or workflows to maintain consistency and save time.'
    },
    {
      question: 'Real-time Collaboration & Sharing',
      answer: 'Share tasks and projects with team members, add comments, mentions, and collaborate in real-time with permission controls.'
    },
    {
      question: 'Advanced Search & AI Integration',
      answer: 'Powerful search across all content, AI-powered suggestions for task organization, and smart automation for productivity enhancement.'
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-content">
        {/* Header Section */}
        <section className="contact-header">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">
            Have questions, suggestions, or need help? We'd love to hear from you! 
            Reach out using any of the methods below.
          </p>
        </section>

        {/* Contact Info Cards */}
        <section className="contact-info-section">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="contact-info-card"
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
              >
                <div className="contact-icon">{info.icon}</div>
                <h3 className="contact-title">{info.title}</h3>
                <p className="contact-detail">{info.content}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="5"
                  required
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  ❌ Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary submit-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Find quick answers to common questions about TaskFlow.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item">
                <summary className="faq-question">
                  <span>{faq.question}</span>
                  <span className="faq-toggle">+</span>
                </summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Social Links Section */}
        <section className="social-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Twitter">
              <span>🐦</span>
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <span>💻</span>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <span>💼</span>
            </a>
            <a href="#" className="social-link" aria-label="Discord">
              <span>💬</span>
            </a>
          </div>
          <p className="social-text">
            Stay updated with the latest features and join our community!
          </p>
        </section>
      </div>
    </div>
  );
};

export default Contact;
