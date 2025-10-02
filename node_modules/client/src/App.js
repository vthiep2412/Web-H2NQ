import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import WaitingPage from './pages/WaitingPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';

const IntroductionPage = React.lazy(() => import('./pages/IntroductionPage'));
const AIPage = React.lazy(() => import('./pages/AIPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const TrollPage = React.lazy(() => import('./pages/TrollPage'));

function App() {
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('/api/health');
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
        <Route 
          path="/ai" 
          element={
            <ProtectedRoute>
              <AIPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/troll" element={<TrollPage />} />
        <Route path="*" element={<IntroductionPage />} /> {/* Catch-all route */}
      </Routes>
    </Suspense>
  );
}

export default App;