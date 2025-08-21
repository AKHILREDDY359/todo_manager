import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DateTasks = () => {
  const { date } = useParams();
  
  console.log('DateTasks component loaded! Date parameter:', date);
  
  return (
    <div style={{ 
      padding: '100px 20px', 
      textAlign: 'center',
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <h1>DateTasks Component Working!</h1>
      <p>Date parameter: {date || 'No date parameter'}</p>
      <p>Route: /date/{date}</p>
      
      <Link 
        to="/" 
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        <ArrowLeft size={16} style={{ marginRight: '8px' }} />
        Back to Home
      </Link>
    </div>
  );
};

export default DateTasks;
