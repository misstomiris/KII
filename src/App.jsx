import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f5f7fa',
      color: '#2c3e50',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '1rem' }}>Система анализа киберугроз</h1>
        <p>Банковская информационная инфраструктура</p>
        <div style={{ marginTop: '2rem' }}>
          <button
            style={{
              background: '#1e88e5',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Начать работу
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;