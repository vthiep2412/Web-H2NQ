import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import WaitingPage from './pages/WaitingPage';
import './App.css';

const IntroductionPage = React.lazy(() => import('./pages/IntroductionPage'));
const AIPage = React.lazy(() => import('./pages/AIPage'));

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
    <Suspense fallback={<div className="d-flex align-items-center justify-content-center vh-100"><h2>Loading...</h2></div>}>
      <Routes>
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;