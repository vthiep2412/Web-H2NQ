import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import VerticalNavbar from '../components/VerticalNavbar';
import ChatView from '../components/ChatView';
import IDEPage from './IDEPage';
import StoragePage from './StoragePage';
import AIMemoryPage from './AIMemoryPage';
import SettingsPage from './SettingsPage';
import useWorkspaces from '../hooks/useWorkspaces';
import '../App.css';


function AIPage() {
  // UI State
  const [theme, setTheme] = useState('light');
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [manualNavClose, setManualNavClose] = useState(false);
  const [activeView, setActiveView] = useState('chat1');
  const navbarRef = useRef(null);

  // Workspace State
  const { workspaces, addWorkspace, editWorkspace, deleteWorkspace } = useWorkspaces();

  // Model State
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  // Chat State
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/messages')
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
      // console.log('Resizing...', { width: window.innerWidth, isNavbarVisible, manualNavClose });
      if (window.innerWidth < 992) {
        if (isNavbarVisible) {
          // console.log('Closing on resize');
          toggleNavbar();
        }
      } else {
        if (!manualNavClose && !isNavbarVisible) {
          // console.log('Opening on resize');
          toggleNavbar();
        }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [manualNavClose, isNavbarVisible]); // Added isNavbarVisible to dependency array

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
  const handleSubmit = async (message) => {
    if (message.trim()) {
      console.log("Sending message from client...");
      const newMessage = { text: message, sender: 'user' };
      const loadingMessage = { id: 'loading', sender: 'ai', type: 'loading' };
      setMessages([...messages, newMessage, loadingMessage]);

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setTimer((Date.now() - startTime) / 1000);
      }, 100);

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, model: selectedModel }),
        });

        clearInterval(timerRef.current);
        setTimer(0);

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = { text: `Error: ${errorData.error}`, sender: 'ai', type: 'error' };
          setMessages(prevMessages => [...prevMessages.filter(m => m.id !== 'loading'), errorMessage]);
          return;
        }

        const data = await response.json();
        const thinkingTime = (Date.now() - startTime) / 1000;
        setMessages(prevMessages => [...prevMessages.filter(m => m.id !== 'loading'), { text: data.text, sender: 'ai', model: data.model, thinkingTime }]);
      } catch (error) {
        console.error('Error sending message:', error);
        clearInterval(timerRef.current);
        setTimer(0);
        setMessages(prevMessages => prevMessages.filter(m => m.id !== 'loading'));
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleNavbar = () => {
    // console.log('Toggling navbar. Current state:', isNavbarVisible);
    const isClosing = isNavbarVisible;
    if (isClosing && navbarRef.current) {
      const width = navbarRef.current.offsetWidth;
      navbarRef.current.style.setProperty('margin-left', -width + 'px');
    }else{
      navbarRef.current.style.setProperty('margin-left', 0);
    }

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
    if (window.innerWidth < 992 && isNavbarVisible) {
      toggleNavbar();
    }
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
                  onSubmit={handleSubmit}
                  messagesEndRef={messagesEndRef}
                  selectedModel={selectedModel}
                  timer={timer}
                  isNavbarVisible={isNavbarVisible}
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
        <div ref={navbarRef} className={`navbar-container ${isNavbarVisible ? 'visible' : ''}`}>
          <VerticalNavbar 
            activeView={activeView} 
            onViewChange={handleViewChange}
            workspaces={workspaces}
            addWorkspace={addWorkspace}
            editWorkspace={editWorkspace}
            deleteWorkspace={deleteWorkspace}
          />
        </div>
        <div className="d-flex flex-column flex-grow-1 idk" style={{ overflow: 'hidden' }}>
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}

export default AIPage;