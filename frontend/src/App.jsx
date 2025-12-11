import { useState, useEffect } from 'react';
import DocumentList from './components/DocumentList';
import DocumentUpload from './components/DocumentUpload';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check system preference or saved theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <button
            onClick={toggleTheme}
            className="btn"
            style={{
              background: 'transparent',
              fontSize: '1.5rem',
              padding: '0.5rem',
              boxShadow: 'none'
            }}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <h1>MediKeep: A Patient Document Portal</h1>
      </header>
      <main className="app-main">
        <DocumentUpload onUploadSuccess={handleUploadSuccess} />
        <DocumentList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}

export default App;
