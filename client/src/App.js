import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroductionPage from './pages/IntroductionPage';
import AIPage from './pages/AIPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroductionPage />} />
      <Route path="/ai" element={<AIPage />} />
    </Routes>
  );
}

export default App;