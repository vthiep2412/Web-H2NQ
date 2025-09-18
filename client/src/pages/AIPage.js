import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import VerticalNavbar from '../components/VerticalNavbar';
import ChatView from '../components/ChatView';
import IDEPage from './IDEPage';
import StoragePage from './StoragePage';
import AIMemoryPage from './AIMemoryPage';
import SettingsPage from './SettingsPage';
import useWorkspaces from '../hooks/useWorkspaces';


function AIPage() {
  // UI State
  const [theme, setTheme] = useState('light');
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [manualNavClose, setManualNavClose] = useState(false);
  const [activeView, setActiveView] = useState('chat1');

  // Workspace State
  const { workspaces, addWorkspace, editWorkspace, deleteWorkspace } = useWorkspaces();

  // Model State
  const [selectedModel, setSelectedModel] = useState('Gemini-Flash');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('http://localhost:3001/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Error fetching messages:', err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsNavbarVisible(false);
      } else {
        if (!manualNavClose) {
          setIsNavbarVisible(true);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [manualNavClose]);

  useEffect(() => {
    const setPageHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setPageHeight);
    setPageHeight();

    return () => window.removeEventListener('resize', setPageHeight);
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      // Simulate AI response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: `Response from ${selectedModel}.`, sender: 'ai' }]);
      }, 1000);
      setInput('');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleNavbar = () => {
    const nextState = !isNavbarVisible;
    setIsNavbarVisible(nextState);
    if (window.innerWidth >= 992 && nextState === false) {
      // User is manually closing on desktop
      setManualNavClose(true);
    }
    if (nextState === true) {
      // User is opening it, so reset the manual flag
      setManualNavClose(false);
    }
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
  };

  const renderActiveView = () => {
    const viewType = activeView.replace(/[0-9]/g, '');
    switch (viewType) {
      case 'ide':
        return <IDEPage />;
      case 'store':
        return <StoragePage />;
      case 'mem':
        return <AIMemoryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'chat':
      default:
        return <ChatView 
                  messages={messages}
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  messagesEndRef={messagesEndRef}
                  selectedModel={selectedModel}
                />;
    }
  }

  return (
    <div className="d-flex flex-column ai-page">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleNavbar={toggleNavbar}
        selectedModel={selectedModel}
        handleModelChange={handleModelChange}
      />
      <div style={{ display: 'flex', flex: '1 1 auto', overflow: 'hidden' }}>
        <div className={`navbar-container ${isNavbarVisible ? 'visible' : ''}`}>
          <VerticalNavbar 
            activeView={activeView} 
            onViewChange={handleViewChange}
            workspaces={workspaces}
            addWorkspace={addWorkspace}
            editWorkspace={editWorkspace}
            deleteWorkspace={deleteWorkspace}
          />
        </div>
        <div className="d-flex flex-column flex-grow-1" style={{ overflow: 'hidden' }}>
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}

export default AIPage;