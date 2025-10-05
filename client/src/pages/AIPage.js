import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import VerticalNavbar from '../components/VerticalNavbar';
import ProfileNavbar from '../components/ProfileNavbar'; // New
import ChatView from '../components/ChatView';
import IDEPage from './IDEPage';
import StoragePage from './StoragePage';
import AIMemoryPage from './AIMemoryPage';
import SettingsPage from './SettingsPage';
import useWorkspaces from '../hooks/useWorkspaces';
import LiquidBackground from '../components/LiquidBackground';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import HistoryNavbar from '../components/HistoryNavbar';
import Modal from '../components/Modal';
import '../App.css';
import './AIPage.css';
import '../gradient.css';


function AIPage() {
  // UI State
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isProfileNavbarVisible, setIsProfileNavbarVisible] = useState(false);
  const [isHistoryNavbarVisible, setIsHistoryNavbarVisible] = useState(false); // New state for history navbar
  const [manualNavOpen, setManualNavOpen] = useState(false);
  const [manualNavClose, setManualNavClose] = useState(false);
  const [activeView, setActiveView] = useState('chat1');
  const navbarRef = useRef(null);
  const screenSizeRef = useRef(window.innerWidth < 992 ? 'small' : 'large');

  // New Theme State
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#007bff',
  });
  const [selectedGradientType, setSelectedGradientType] = useState('off'); // 'off', 'animated', 'gradient'
  const [secondaryColor, setSecondaryColor] = useState('#00ff00'); // Default secondary color
  const [gradientColors] = useState(['#ff0000', '#0000ff']);
  const [gradientColor1, setGradientColor1] = useState('#ff0000');
  const [gradientColor2, setGradientColor2] = useState('#0000ff');
  const [isGradientNone, setIsGradientNone] = useState(true);
  const [isGradientColor1Enabled, setIsGradientColor1Enabled] = useState(false);
  const [isGradientColor2Enabled, setIsGradientColor2Enabled] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('none');

  // Workspace State
  const { workspaces, addWorkspace, editWorkspace, deleteWorkspace, updateWorkspaceMemories } = useWorkspaces();

  // AI Memory State
  const activeWorkspace = useMemo(() => {
    return workspaces.find(ws => ws.children.some(child => child.id === activeView));
  }, [workspaces, activeView]);
  const memories = activeWorkspace ? activeWorkspace.memories : [];

  // Model State
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isGreetingShown, setIsGreetingShown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [shouldFetchConversations, setShouldFetchConversations] = useState(false); // New state

  const { user, logout, updateUser } = useAuth(); // Get user and logout from AuthContext

  const handleTypingComplete = useCallback(() => {
    setShouldFetchConversations(true); // Trigger conversation fetch after typing is complete
  }, []);

  const addMemory = (text) => {
    if (text && activeWorkspace) {
      const newMemories = [...memories, { text }];
      updateWorkspaceMemories(activeWorkspace.id, newMemories);
    }
  };

  const deleteMemory = (id) => {
    if (activeWorkspace) {
      const newMemories = memories.filter(mem => mem._id !== id);
      updateWorkspaceMemories(activeWorkspace.id, newMemories);
    }
  };

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

    const gradientColorsArray = [customTheme.primaryColor];
    if (isGradientColor1Enabled) gradientColorsArray.push(gradientColor1);
    if (isGradientColor2Enabled) gradientColorsArray.push(gradientColor2);

    if (gradientColorsArray.length > 1) {
      root.style.setProperty('--primary-background', `linear-gradient(135deg, ${gradientColorsArray.join(', ')})`);
    } else {
      root.style.setProperty('--primary-background', customTheme.primaryColor);
    }

    root.style.setProperty('--gradient-color-1', gradientColors[0]);
    root.style.setProperty('--gradient-color-2', gradientColors[1]);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [customTheme, theme, gradientColors, isGradientColor1Enabled, isGradientColor2Enabled, gradientColor1, gradientColor2]);

  useEffect(() => {
    const body = document.body;
    if (selectedGradientType === 'gradient') {
      body.style.background = `linear-gradient(135deg, ${customTheme.primaryColor} 0%, ${gradientColors[0]} 50%, ${gradientColors[1]} 100%)`;
    } else if (selectedGradientType === 'animated') {
      body.style.background = 'transparent';
    } else { // 'off' or any other case
      body.style.background = ''; // Revert to default
    }
  }, [customTheme, theme, selectedGradientType, gradientColors]);


  useEffect(() => {
    if (workspaces.length > 0 && activeView === 'chat1') {
      setActiveView(workspaces[0].children[0].id);
    }
  }, [workspaces, activeView]);

  const showGreetingMessage = useCallback(() => {
    const greetings = [
      'Hello! How can I help you today?',
      'Hi there! What can I do for you?',
      'Greetings! What are we working on?',
      'Welcome! Ask me anything.',
      'Hey! Ready to get started?',
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setMessages([{ text: randomGreeting, sender: 'ai', isNew: false }]);
    setIsGreetingShown(true);
  }, []);

  const userId = user?._id;
  const initialFetchDone = useRef(false);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!activeWorkspace) {
        return;
      }
      // Only run initial fetch once
      if (initialFetchDone.current) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/conversations?workspaceId=${activeWorkspace.id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        const data = await res.json();
        setConversations(data);
        if (data.length > 0) {
          setActiveConversationId(data[0]._id);
          const mappedMessages = data[0].messages.map(msg => ({
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: msg.thinkingTime,
            isNew: false, // Loaded messages are not new
          }));
          setMessages(mappedMessages);
        } else if (!isGreetingShown) {
          showGreetingMessage();
          setActiveConversationId(null);
        }
      } catch (err) {
        console.error('Initial fetchConversations: Error fetching conversations:', err);
      } finally {
        initialFetchDone.current = true; // Mark initial fetch as done
      }
    };

    if (user && activeWorkspace) {
      fetchConversations();
    }
  }, [userId, activeWorkspace, showGreetingMessage, isGreetingShown]);

  useEffect(() => {
    const updateCurrentConversation = async () => {
      if (shouldFetchConversations && activeConversationId) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/conversations/${activeConversationId}`, {
            headers: {
              'x-auth-token': token,
            },
          });
          const data = await res.json();
          setConversations(prevConvos => prevConvos.map(convo => 
            convo._id === activeConversationId ? data : convo
          ));
          setShouldFetchConversations(false); // Reset after fetching
        } catch (err) {
          console.error('Error updating current conversation:', err);
        }
      } else if (shouldFetchConversations && !activeConversationId) {
      } else {
      }
    };
    updateCurrentConversation();
  }, [shouldFetchConversations, activeConversationId, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 500);
    return () => clearTimeout(timer);
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
      const userMessage = { text: message, sender: 'user' };
      const loadingMessage = { id: 'loading', sender: 'ai', type: 'loading' };

      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      setMessages([...messages, userMessage, loadingMessage]);
      setShouldFetchConversations(false); // Prevent premature fetch

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setTimer((Date.now() - startTime) / 1000);
      }, 100);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ message, model: selectedModel, history: conversationHistory, conversationId: activeConversationId, memories, workspaceId: activeWorkspace.id }),
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
        if (data.truncated) {
          setShowModal(true);
        }
        const aiMessage = { text: data.text, sender: 'ai', model: data.model, thinkingTime: data.thinkingTime, isNew: true }; // New AI messages are new

        if (data.user) {
          updateUser(data.user);
        }

        if (data.conversation && !activeConversationId) {
          setConversations(prev => [data.conversation, ...prev]);
          setActiveConversationId(data.conversation._id);
          const mappedMessages = data.conversation.messages.map(msg => ({
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: msg.thinkingTime,
            isNew: false, // Loaded messages are not new
          }));
          setMessages(mappedMessages);
        } else {
          setMessages(prevMessages => [...prevMessages.filter(m => m.id !== 'loading'), aiMessage]);
          // Update the conversations state as well
          setConversations(prevConvos => prevConvos.map(convo => {
            if (convo._id === activeConversationId) {
              const newMessages = [...convo.messages, {role: 'user', content: message}, {role: 'assistant', content: data.text, model: data.model, thinkingTime: data.thinkingTime}];
              return { ...convo, messages: newMessages };
            }
            return convo;
          }));
        }
      } catch (error) {
        console.error('handleSubmit: Error sending message:', error);
        clearInterval(timerRef.current);
        setTimer(0);
        setMessages(prevMessages => prevMessages.filter(m => m.id !== 'loading'));
      } finally {
      }
    }
  };

  const handleLocalChat = (message, sender) => {
    const newMessage = { text: message, sender: sender };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSelectGradient = (type) => {
    setSelectedGradientType(type);
  };



  const handleThemeChange = (newTheme) => {
    setCustomTheme(newTheme);
  };

  const handleSecondaryColorChange = (color) => {
    setSecondaryColor(color);
  };

  const handleGradientColor1Change = (color) => {
    setGradientColor1(color);
  };

  const handleGradientColor2Change = (color) => {
    setGradientColor2(color);
  };

  const handleGradientToggle = (toggle) => {
    if (toggle === 'none') {
      setIsGradientNone(true);
      setIsGradientColor1Enabled(false);
      setIsGradientColor2Enabled(false);
    } else if (toggle === 'color1') {
      setIsGradientNone(false);
      setIsGradientColor1Enabled(!isGradientColor1Enabled);
    } else if (toggle === 'color2') {
      setIsGradientNone(false);
      setIsGradientColor2Enabled(!isGradientColor2Enabled);
    }
  };

  const toggleProfileNavbar = () => {
    setIsProfileNavbarVisible(!isProfileNavbarVisible);
  };

  const toggleHistoryNavbar = () => {
    setIsHistoryNavbarVisible(!isHistoryNavbarVisible);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    if (window.innerWidth < 992 && isNavbarVisible && !manualNavOpen) {
      toggleNavbar(false);
    }
    // Check if the new view is an AI Chat view
    if (viewId.endsWith('-chat')) {
      // Delay scrolling to ensure the ChatView component has rendered and messages are in place
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleBackgroundChange = (background) => {
    setSelectedBackground(background);
  };

  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.find(c => c._id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      const mappedMessages = conversation.messages.map(msg => ({
        sender: msg.role === 'assistant' ? 'ai' : 'user',
        text: msg.content,
        model: msg.model,
        thinkingTime: msg.thinkingTime,
        isNew: false, // Loaded messages are not new
      }));
      setMessages(mappedMessages);
      if (window.innerWidth < 576) {
        setIsHistoryNavbarVisible(false); // Close history navbar after selection
      }
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    showGreetingMessage();
  };

  const handleTestModal = () => {
    setShowModal(true);
  };

  const renderActiveView = () => {
    const viewType = activeView.split('-').pop();
    const userMessages = messages.filter(msg => msg.sender === 'user').slice(-50);

    switch (viewType) {
      case 'ide':
        return <IDEPage />;
      case 'store':
        return <StoragePage />;
      case 'mem':
        return <AIMemoryPage memories={memories} addMemory={addMemory} deleteMemory={deleteMemory} />;
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
                  toggleHistoryNavbar={toggleHistoryNavbar} // Pass toggle function
                  onNewConversation={handleNewConversation} // Pass new conversation function
                  onTestModal={handleTestModal}
                  onTypingComplete={handleTypingComplete}
                />;
    }
  }

  return (
    <div 
      className={`d-flex flex-column ai-page ${selectedGradientType === 'animated' ? 'animated-background-on' : ''} ${selectedGradientType === 'gradient' ? 'gradient-text' : ''}`}
    >
      {selectedBackground === 'coloredSnowy' && (
        <div className="ai-page-background">
          <LiquidBackground
            primaryColor={customTheme.primaryColor}
            gradientColor1={isGradientColor1Enabled ? gradientColor1 : null}
            gradientColor2={isGradientColor2Enabled ? gradientColor2 : null}
            theme={theme}
          />
        </div>
      )}
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
            toggleHistoryNavbar={toggleHistoryNavbar}
            isHistoryNavbarVisible={isHistoryNavbarVisible}
            screenSizeRef={screenSizeRef}
            toggleNavbar={toggleNavbar}
          />
        </div>
        <div className="d-flex flex-column flex-grow-1 idk" style={{ overflow: 'hidden' }}>
          {renderActiveView()}
        </div>
        <div className={`history-navbar-container ${isHistoryNavbarVisible ? 'visible' : ''}`}>
          <HistoryNavbar conversations={conversations} onSelectConversation={handleSelectConversation} onClose={toggleHistoryNavbar} />
        </div>
        <div className={`profile-navbar-container ${isProfileNavbarVisible ? 'visible' : ''}`}>
          {user && (
            <ProfileNavbar
              currentTheme={theme}
              customTheme={customTheme}
              onThemeChange={handleThemeChange}
              onLogout={logout} // Use logout from AuthContext
              selectedGradientType={selectedGradientType}
              onSelectGradient={handleSelectGradient}
              secondaryColor={secondaryColor}
              onSecondaryColorChange={handleSecondaryColorChange}
              gradientColor1={gradientColor1}
              gradientColor2={gradientColor2}
              onGradientColor1Change={handleGradientColor1Change}
              onGradientColor2Change={handleGradientColor2Change}
              isGradientNone={isGradientNone}
              isGradientColor1Enabled={isGradientColor1Enabled}
              isGradientColor2Enabled={isGradientColor2Enabled}
              onGradientToggle={handleGradientToggle}
              selectedBackground={selectedBackground}
              onBackgroundChange={handleBackgroundChange}
              user={user} // Pass user object
            />
          )}
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <p>The conversation history has been shortened to meet the context limit.</p>
      </Modal>
    </div>
  );
}
export default AIPage;
