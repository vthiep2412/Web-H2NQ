import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroductionPage from './pages/IntroductionPage';
import AIPage from './pages/AIPage';
import WaitingPage from './pages/WaitingPage';
import './App.css';

function App() {
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Theme state lifted from pages
  const [theme, setTheme] = useState('dark'); // For bootstrap components
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#007bff',
  });

  // Effect for bootstrap theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  // Effect for new custom theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', customTheme.primaryColor);
  }, [customTheme, theme]);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('/health');
        if (response.ok) {
          setIsServerOnline(true);
        }
      } catch (error) {
        // Server is not online
      } finally {
        setIsLoading(false);
      }
    };

    checkServerStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <h2>Checking server status...</h2>
      </div>
    );
  }

  if (!isServerOnline) {
    return <WaitingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<IntroductionPage />} />
      <Route path="/ai" element={<AIPage />} />
    </Routes>
  );
}

export default App;