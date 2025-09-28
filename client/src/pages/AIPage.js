import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import VerticalNavbar from '../components/VerticalNavbar';
import ProfileNavbar from '../components/ProfileNavbar'; // New
import ChatView from '../components/ChatView';
import IDEPage from './IDEPage';
import StoragePage from './StoragePage';
import AIMemoryPage from './AIMemoryPage';
import SettingsPage from './SettingsPage';
import useWorkspaces from '../hooks/useWorkspaces';
import '../App.css';


function AIPage() {
  // UI State
  const [theme, setTheme] = useState('dark'); // For bootstrap components
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isProfileNavbarVisible, setIsProfileNavbarVisible] = useState(false);
  const [manualNavOpen, setManualNavOpen] = useState(false);
  const [manualNavClose, setManualNavClose] = useState(false);
  const [activeView, setActiveView] = useState('chat1');
  const navbarRef = useRef(null);
  const screenSizeRef = useRef(window.innerWidth < 992 ? 'small' : 'large');

  // New Theme State
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#007bff',
    background: 'dark' // 'dark', 'light', 'gradient'
  });

  // Workspace State
  const { workspaces, addWorkspace, editWorkspace, deleteWorkspace } = useWorkspaces();

  // Model State
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  // Chat State
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const toggleNavbar = useCallback((forceState) => {
    const isManualToggle = forceState === null || forceState === undefined;
    const nextState = isManualToggle ? !isNavbarVisible : forceState;

    if (isNavbarVisible && !nextState && navbarRef.current) { // Closing
      const width = navbarRef.current.offsetWidth;
      navbarRef.current.style.setProperty('margin-left', -width + 'px');
      if (isManualToggle) {
        setManualNavOpen(false);
        setManualNavClose(true);
      }
    } else if (!isNavbarVisible && nextState && navbarRef.current) { // Opening
      navbarRef.current.style.setProperty('margin-left', 0);
      if (isManualToggle) {
        setManualNavOpen(true);
        setManualNavClose(false);
      }
    }

    setIsNavbarVisible(nextState);
  }, [isNavbarVisible]);

  // Effect for new custom theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', customTheme.primaryColor);

    let newTheme = 'dark'; // Default to dark
    if (customTheme.background === 'gradient') {
      root.style.setProperty('--background-body', `linear-gradient(135deg, ${customTheme.primaryColor} 0%, ${theme === 'dark' ? '#212529' : '#f8f9fa'} 100%)`);
      newTheme = 'dark';
    } else if (customTheme.background === 'white') {
        root.style.setProperty('--background-body', '#ffffff');
        newTheme = 'light';
    } else if (customTheme.background === 'black') {
        root.style.setProperty('--background-body', '#000000');
        newTheme = 'dark';
    }
    setTheme(newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);

  }, [customTheme, theme]);


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
      const newScreenSize = window.innerWidth < 992 ? 'small' : 'large';
      if (newScreenSize !== screenSizeRef.current) {
        setManualNavOpen(false);
        setManualNavClose(false);
      }

      if (newScreenSize === 'small') {
        if (isNavbarVisible && !manualNavOpen) toggleNavbar(false);
      } else {
        if (!isNavbarVisible && !manualNavClose) toggleNavbar(true);
      }

      screenSizeRef.current = newScreenSize;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isNavbarVisible, manualNavOpen, manualNavClose, toggleNavbar]);

  useEffect(() => {
    if (window.innerWidth < 992 && isNavbarVisible && !manualNavOpen) {
      toggleNavbar(false);
    }
  }, [activeView, isNavbarVisible, manualNavOpen, toggleNavbar]);

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

  const handleLocalChat = (message, sender) => {
    const newMessage = { text: message, sender: sender };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const toggleTheme = () => {
    const newBsTheme = theme === 'light' ? 'dark' : 'light';
    setCustomTheme(prev => ({...prev, background: newBsTheme}));
  };

  const handleThemeChange = (newTheme) => {
    setCustomTheme(newTheme);
  };

  const toggleProfileNavbar = () => {
    setIsProfileNavbarVisible(!isProfileNavbarVisible);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    if (window.innerWidth < 992 && isNavbarVisible && !manualNavOpen) {
      toggleNavbar(false);
    }
  };

  const renderActiveView = () => {
    const viewType = activeView.replace(/[0-9]/g, '');
    const userMessages = messages.filter(msg => msg.sender === 'user').slice(-50);

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
                  onLocalChat={handleLocalChat}
                  messagesEndRef={messagesEndRef}
                  selectedModel={selectedModel}
                  timer={timer}
                  isNavbarVisible={isNavbarVisible}
                  userMessages={userMessages}
                />;
    }
  }

  return (
    <div className="d-flex flex-column ai-page">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleNavbar={toggleNavbar}
        toggleProfileNavbar={toggleProfileNavbar}
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
        <div className={`profile-navbar-container ${isProfileNavbarVisible ? 'visible' : ''}`}>
          <ProfileNavbar
            theme={customTheme}
            onThemeChange={handleThemeChange}
            onLogout={() => alert("Logout functionality not implemented yet.")}
          />
        </div>
      </div>
    </div>
  );
}

export default AIPage;