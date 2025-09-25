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
  const navbarRef = useRef(null);

  // Workspace State
  const { workspaces, addWorkspace, editWorkspace, deleteWorkspace } = useWorkspaces();

  // Model State
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      console.log("Sending message from client...");
      const newMessage = { text: input, sender: 'user' };
      const loadingMessage = { id: 'loading', sender: 'ai', type: 'loading' };
      setMessages([...messages, newMessage, loadingMessage]);
      setInput('');

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input, model: selectedModel }),
        });

        const data = await response.json();
        setMessages(prevMessages => [...prevMessages.filter(m => m.id !== 'loading'), { text: data.text, sender: 'ai', model: data.model }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => prevMessages.filter(m => m.id !== 'loading'));
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleNavbar = () => {
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
    if (window.innerWidth < 992) {
      setIsNavbarVisible(false);
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
        <div className="d-flex flex-column flex-grow-1" style={{ overflow: 'hidden' }}>
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}

export default AIPage;