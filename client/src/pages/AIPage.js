import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
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
// import AnimatedGradient from '../components/AnimatedGradient';
import FloatingSquares from '../components/FloatingSquares';
import SvgAnimation from '../components/SvgAnimation';
import MovingSquares from '../components/MovingSquares';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import HistoryNavbar from '../components/HistoryNavbar';
import { useTranslation } from 'react-i18next';
import Modal from '../components/Modal';
import '../App.css';
import './AIPage.css';
import '../gradient.css';


function AIPage() {
  const { t, i18n } = useTranslation();
  const { user, logout, updateUser } = useAuth(); // Get user and logout from AuthContext

  // UI State
  const [theme, setTheme] = useState(user?.settings?.theme || 'dark');
  const [language, setLanguage] = useState(user?.settings?.language || 'en');
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isProfileNavbarVisible, setIsProfileNavbarVisible] = useState(false);
  const [isHistoryNavbarVisible, setIsHistoryNavbarVisible] = useState(false); // New state for history navbar
  const [manualNavOpen, setManualNavOpen] = useState(false);
  const [manualNavClose, setManualNavClose] = useState(false);
  const [activeView, setActiveView] = useState('chat1');
  const navbarRef = useRef(null);
  const screenSizeRef = useRef(window.innerWidth < 992 ? 'small' : 'large');
  const isInitialMount = useRef(true);

  // New Theme State
  const [customTheme, setCustomTheme] = useState({
    primaryColor: user?.settings?.primaryColor || '#007bff',
  });
  const [selectedGradientType, setSelectedGradientType] = useState('off'); // 'off', 'animated', 'gradient'
  const [secondaryColor, setSecondaryColor] = useState('#00ff00'); // Default secondary color
  const [gradientColors] = useState(['#ff0000', '#0000ff']);
  const [gradientColor1, setGradientColor1] = useState(user?.settings?.gradientColor1 || '#ff0000');
  const [gradientColor2, setGradientColor2] = useState(user?.settings?.gradientColor2 || '#0000ff');
  const [isGradientNone, setIsGradientNone] = useState(true);
  const [isGradientColor1Enabled, setIsGradientColor1Enabled] = useState(user?.settings?.isGradientColor1Enabled || false);
  const [isGradientColor2Enabled, setIsGradientColor2Enabled] = useState(user?.settings?.isGradientColor2Enabled || false);
  const [isGradientAnimated, setIsGradientAnimated] = useState(user?.settings?.isGradientAnimated || false);
  const [hasGradient, setHasGradient] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(user?.settings?.selectedBackground || 'none');
  const [darkBackgroundColor, setDarkBackgroundColor] = useState(user?.settings?.darkBackgroundColor || '#111212');
  const [lightBackgroundColor, setLightBackgroundColor] = useState(user?.settings?.lightBackgroundColor || '#ffffff');
  const [gradientBackgroundColor1, setGradientBackgroundColor1] = useState(user?.settings?.gradientBackgroundColor1 || '#ff0000');
  const [gradientBackgroundColor2, setGradientBackgroundColor2] = useState(user?.settings?.gradientBackgroundColor2 || '#0000ff');
  const [isGradientBackgroundColor1Enabled, setIsGradientBackgroundColor1Enabled] = useState(user?.settings?.isGradientBackgroundColor1Enabled || false);
  const [isGradientBackgroundColor2Enabled, setIsGradientBackgroundColor2Enabled] = useState(user?.settings?.isGradientBackgroundColor2Enabled || false);
  const [gradientDirection, setGradientDirection] = useState(user?.settings?.gradientDirection || 'to bottom');
  const [isGradientBackgroundAnimated, setIsGradientBackgroundAnimated] = useState(user?.settings?.isGradientBackgroundAnimated || false);

  // Workspace State
  const { workspaces, addWorkspace, editWorkspace, deleteWorkspace, updateWorkspaceMemories, getWorkspaces, updateLastActiveWorkspace } = useWorkspaces();

  // AI Memory State
  const activeWorkspace = useMemo(() => {
    return workspaces.find(ws => ws.children.some(child => child.id === activeView));
  }, [workspaces, activeView]);
  const memories = activeWorkspace ? activeWorkspace.memories : [];

  // Model State
  const [selectedModel, setSelectedModel] = useState(user?.settings?.selectedModel || 'gemini-2.5-flash');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [conversationsByWorkspace, setConversationsByWorkspace] = useState({}); // Changed to object
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isGreetingShown, setIsGreetingShown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [shouldFetchConversations, setShouldFetchConversations] = useState(false); // New state

  // State persistence with Local Storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedConversationsByWorkspace = localStorage.getItem('chatConversationsByWorkspace'); // Changed key
    const savedActiveConversationId = localStorage.getItem('activeConversationId');
    const savedIsGreetingShown = localStorage.getItem('isGreetingShown');
    const savedSelectedModel = localStorage.getItem('selectedModel');


    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedConversationsByWorkspace) setConversationsByWorkspace(JSON.parse(savedConversationsByWorkspace)); // Changed setter
    if (savedActiveConversationId) setActiveConversationId(savedActiveConversationId);
    if (savedIsGreetingShown) setIsGreetingShown(JSON.parse(savedIsGreetingShown));
    if (savedSelectedModel) setSelectedModel(savedSelectedModel);

  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatConversationsByWorkspace', JSON.stringify(conversationsByWorkspace));
  }, [conversationsByWorkspace]);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('activeConversationId', activeConversationId);
    } else {
      localStorage.removeItem('activeConversationId');
    }
  }, [activeConversationId]);

  useEffect(() => {
    localStorage.setItem('isGreetingShown', JSON.stringify(isGreetingShown));
  }, [isGreetingShown]);

  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.removeItem('activeView');
  }, []);

  useEffect(() => {
    getWorkspaces();
  }, [getWorkspaces]);

  const saveSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const settingsToSave = {
        theme,
        primaryColor: customTheme.primaryColor,
        gradientColor1,
        gradientColor2,
        isGradientColor1Enabled,
        isGradientColor2Enabled,
        isGradientAnimated,
        selectedModel,
        selectedBackground,
        language,
        lastActiveWorkspace: activeWorkspace?.id,
        darkBackgroundColor,
        lightBackgroundColor,
        gradientBackgroundColor1,
        gradientBackgroundColor2,
        isGradientBackgroundColor1Enabled,
        isGradientBackgroundColor2Enabled,
        gradientDirection,
        isGradientBackgroundAnimated,
      };
      const response = await fetch('/api/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ settings: settingsToSave }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        // console.log('Settings saved successfully:', updatedUser);
      } else {
        console.error('Failed to save settings:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [updateUser, theme, customTheme.primaryColor, gradientColor1, gradientColor2, isGradientColor1Enabled, isGradientColor2Enabled, isGradientAnimated, selectedModel, selectedBackground, language, activeWorkspace, darkBackgroundColor, lightBackgroundColor, gradientBackgroundColor1, gradientBackgroundColor2, isGradientBackgroundColor1Enabled, isGradientBackgroundColor2Enabled, gradientDirection, isGradientBackgroundAnimated]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      saveSettings();
    }
  }, [saveSettings]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
  };

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
      setHasGradient(true);
    } else {
      root.style.setProperty('--primary-background', customTheme.primaryColor);
      setHasGradient(false);
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
      body.style.backgroundImage = 'none'; // Clear gradient, keep color
    }
  }, [customTheme, theme, selectedGradientType, gradientColors]);

  useEffect(() => {
    if (isGradientAnimated) {
        document.body.classList.add('gradient-animated');
    }
    else {
        document.body.classList.remove('gradient-animated');
    }
  }, [isGradientAnimated]);

  useEffect(() => {
    const body = document.body;
    body.style.backgroundColor = theme === 'dark' ? darkBackgroundColor : lightBackgroundColor;
    return () => {
      body.style.backgroundColor = '';
    };
  }, [theme, darkBackgroundColor, lightBackgroundColor]);


  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (workspaces.length > 0 && !initialLoadDone.current) {
      const lastActiveWorkspaceId = user?.settings?.lastActiveWorkspace;
      if (lastActiveWorkspaceId) {
        const lastActiveWs = workspaces.find(ws => ws.id === lastActiveWorkspaceId);
        if (lastActiveWs) {
          setActiveView(`${lastActiveWs.id}-chat`);
        } else {
          setActiveView(`${workspaces[0].id}-chat`);
        }
      } else {
        setActiveView(`${workspaces[0].id}-chat`);
      }
      initialLoadDone.current = true;
    }
  }, [workspaces, user]);

  const showGreetingMessage = useCallback(() => {
    const greetingKeys = [
      'greeting1',
      'greeting2',
      'greeting3',
      'greeting4',
      'greeting5',
      'greeting6',
      'greeting7',
      'greeting8',
      'greeting9',
      'greeting10',
      'greeting11',
    ];
    const randomGreetingKey = greetingKeys[Math.floor(Math.random() * greetingKeys.length)];
    const randomGreeting = t(randomGreetingKey);
    setMessages([{ text: randomGreeting, sender: 'ai', isNew: false }]);
    setIsGreetingShown(true);
  }, [t]);

  const userId = user?._id;

  useEffect(() => {
    const fetchConversations = async () => {
      if (!activeWorkspace || !activeWorkspace.id) {
        return;
      }

      // If conversations for this workspace are already loaded, don't fetch again
      if (conversationsByWorkspace[activeWorkspace.id]) {
        const workspaceConversations = conversationsByWorkspace[activeWorkspace.id];
        if (workspaceConversations.length > 0) {
          setActiveConversationId(workspaceConversations[0]._id);
          const mappedMessages = workspaceConversations[0].messages.map(msg => ({
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: msg.thinkingTime,
            thoughts: msg.thoughts,
            isNew: false, // Loaded messages are not new
          }));
          setMessages(mappedMessages);
        } else {
          showGreetingMessage();
          setActiveConversationId(null);
          setMessages([]);
        }
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

        setConversationsByWorkspace(prev => ({
          ...prev,
          [activeWorkspace.id]: data,
        }));

        if (data.length > 0) {
          setActiveConversationId(data[0]._id);
          const mappedMessages = data[0].messages.map(msg => ({
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: msg.thinkingTime,
            thoughts: msg.thoughts,
            isNew: false, // Loaded messages are not new
          }));
          setMessages(mappedMessages);
        } else {
          showGreetingMessage();
          setActiveConversationId(null);
          setMessages([]);
        }
      } catch (err) {
        console.error('Initial fetchConversations: Error fetching conversations:', err);
      }
    };

    if (user && activeWorkspace) {
      fetchConversations();
    }
  }, [userId, activeWorkspace, showGreetingMessage, user, conversationsByWorkspace, isGreetingShown]);

  useEffect(() => {
    const updateCurrentConversation = async () => {
      if (shouldFetchConversations && activeConversationId && activeWorkspace) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/conversations/${activeConversationId}`, {
            headers: {
              'x-auth-token': token,
            },
          });
          const data = await res.json();
          setConversationsByWorkspace(prev => ({
            ...prev,
            [activeWorkspace.id]: (prev[activeWorkspace.id] || []).map(convo => 
              convo._id === activeConversationId ? data : convo
            ),
          }));
          setShouldFetchConversations(false); // Reset after fetching
        } catch (err) {
          console.error('Error updating current conversation:', err);
        }
      } else if (shouldFetchConversations && !activeConversationId) {
      }
      else {
      }
    };
    updateCurrentConversation();
  }, [shouldFetchConversations, activeConversationId, user, activeWorkspace]);

  const scrollToBottom = () => {
    const el = document.querySelector('.chat-main-view');
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  /*useEffect(() => {
    const setPageHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setPageHeight);
    setPageHeight();

    return () => window.removeEventListener('resize', setPageHeight);
  }, []);*/

  // Handlers
  const handleSubmit = async (message, files = []) => {
    if (message.trim() || files.length > 0) {
      const frontendStartTime = Date.now(); // Record start time on frontend
      const userMessage = { text: message, sender: 'user' };
      if (files.length > 0) {
        userMessage.files = files.map(file => ({ name: file.name, type: file.type }));
      }
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
        let requestBody;
        let headers = {
          'x-auth-token': token,
        };

        if (files.length > 0) {
          const formData = new FormData();
          formData.append('message', message);
          formData.append('model', selectedModel);
          formData.append('history', JSON.stringify(conversationHistory));
          formData.append('conversationId', activeConversationId);
          formData.append('memories', JSON.stringify(memories));
          formData.append('workspaceId', activeWorkspace.id);
          formData.append('language', language);
          files.forEach((file, index) => {
            formData.append(`file${index}`, file);
          });
          requestBody = formData;
          // No Content-Type header for FormData, browser sets it automatically
        } else {
          headers['Content-Type'] = 'application/json';
          requestBody = JSON.stringify({ message, model: selectedModel, history: conversationHistory, conversationId: activeConversationId, memories, workspaceId: activeWorkspace.id, language, frontendStartTime });
        }

        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: headers,
          body: requestBody,
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
        const aiMessage = { text: data.text, sender: 'ai', model: data.model, thinkingTime: data.thinkingTime, thoughts: data.thoughts, isNew: true }; // New AI messages are new

        if (data.user) {
          updateUser(data.user);
        }

        if (data.conversation && !activeConversationId) {
          setConversationsByWorkspace(prev => ({
            ...prev,
            [activeWorkspace.id]: [data.conversation, ...(prev[activeWorkspace.id] || [])],
          }));
          setActiveConversationId(data.conversation._id);
          const conversationMessages = data.conversation.messages;
          const mappedMessages = conversationMessages.map((msg, index) => ({
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: data.thinkingTime, // Use backend thinking time
            thoughts: msg.thoughts,
            isNew: index === conversationMessages.length - 1,
          }));
          setMessages(mappedMessages);
        } else {
          const totalRoundTripTime = (Date.now() - frontendStartTime) / 1000; // Calculate total round-trip time
          setMessages(prevMessages => [...prevMessages.filter(m => m.id !== 'loading'), { ...aiMessage, thinkingTime: totalRoundTripTime }]);
          // Update the conversations state as well
          setConversationsByWorkspace(prev => ({
            ...prev,
            [activeWorkspace.id]: (prev[activeWorkspace.id] || []).map(convo => {
              if (convo._id === activeConversationId) {
                const newMessages = [...convo.messages, { role: 'user', content: message }, { role: 'assistant', content: data.text, model: data.model, thinkingTime: data.thinkingTime }];
                return { ...convo, messages: newMessages };
              }
              return convo;
            }),
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
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  const handleSelectGradient = (type) => {
    setSelectedGradientType(type);
  };



  const handleThemeChange = useMemo(() => debounce((newTheme) => {
    setCustomTheme(newTheme);
  }, 100), []);

  const handleSecondaryColorChange = (color) => {
    setSecondaryColor(color);
  };

  const handleGradientColor1Change = useMemo(() => debounce((color) => {
    setGradientColor1(color);
  }, 100), []);

  const handleGradientColor2Change = useMemo(() => debounce((color) => {
    setGradientColor2(color);
  }, 100), []);

  const handleGradientToggle = (toggle) => {
    if (toggle === 'none') {
      setIsGradientNone(true);
      setIsGradientColor1Enabled(false);
      setIsGradientColor2Enabled(false);
    } else if (toggle === 'color1') {
      setIsGradientNone(false);
      setIsGradientColor1Enabled(prev => !prev);
    } else if (toggle === 'color2') {
      setIsGradientNone(false);
      setIsGradientColor2Enabled(prev => !prev);
    }
  };

  const handleGradientAnimationToggle = () => {
    setIsGradientAnimated(prevState => !prevState);
  };

  const handleDarkBackgroundColorChange = useMemo(() => debounce((color) => {
    setDarkBackgroundColor(color);
  }, 100), []);

  const handleLightBackgroundColorChange = useMemo(() => debounce((color) => {
    setLightBackgroundColor(color);
  }, 100), []);

  const handleGradientBackgroundColor1Change = (e) => {
    setGradientBackgroundColor1(e.target.value);
  };

  const handleGradientBackgroundColor2Change = (e) => {
    setGradientBackgroundColor2(e.target.value);
  };

  const handleGradientBackgroundColor1Toggle = () => {
    setIsGradientBackgroundColor1Enabled(prev => !prev);
  };

  const handleGradientBackgroundColor2Toggle = () => {
    setIsGradientBackgroundColor2Enabled(prev => !prev);
  };

  const handleGradientDirectionChange = (e) => {
    setGradientDirection(e.target.value);
  };

  const handleGradientBackgroundAnimationToggle = () => {
    setIsGradientBackgroundAnimated(prev => !prev);
  };

  const handleRevertAccentGradient = () => {
    handleThemeChange.cancel();
    handleGradientColor1Change.cancel();
    handleGradientColor2Change.cancel();
    setCustomTheme({ primaryColor: '#007bff' });
    setGradientColor1('#ff0000');
    setGradientColor2('#0000ff');
    setIsGradientColor1Enabled(false);
    setIsGradientColor2Enabled(false);
    setIsGradientAnimated(false);
  };

  const handleRevertBackgroundGradient = () => {
    handleDarkBackgroundColorChange.cancel();
    handleLightBackgroundColorChange.cancel();
    setDarkBackgroundColor('#111212');
    setLightBackgroundColor('#ffffff');
    setGradientBackgroundColor1('#ff0000');
    setGradientBackgroundColor2('#0000ff');
    setIsGradientBackgroundColor1Enabled(false);
    setIsGradientBackgroundColor2Enabled(false);
    setGradientDirection('to bottom');
    setIsGradientBackgroundAnimated(false);
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
    const workspaceId = viewId.split('-')[0];
    updateLastActiveWorkspace(workspaceId);
    if (window.innerWidth < 992 && isNavbarVisible && !manualNavOpen) {
      toggleNavbar(false);
    }
    // Check if the new view is an AI Chat view
    if (viewId.endsWith('-chat')) {
      // Delay scrolling to ensure the ChatView component has rendered and messages are in place
      setTimeout(() => {
        const el = document.querySelector('.chat-main-view');
        if (el) {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };

  const handleBackgroundChange = (background) => {
    setSelectedBackground(background);
  };

  const handleSelectConversation = (conversationId) => {
    if (!activeWorkspace || !activeWorkspace.id) return;
    const conversations = conversationsByWorkspace[activeWorkspace.id] || [];
    const conversation = conversations.find(c => c._id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      const mappedMessages = conversation.messages.map(msg => ({
        sender: msg.role === 'assistant' ? 'ai' : 'user',
        text: msg.content,
        model: msg.model,
        thinkingTime: msg.thinkingTime,
        thoughts: msg.thoughts,
        isNew: false, // Loaded messages are not new
      }));
      setMessages(mappedMessages);
      if (window.innerWidth < 576) {
        setIsHistoryNavbarVisible(false); // Close history navbar after selection
      }
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        setConversationsByWorkspace(prev => ({
          ...prev,
          [activeWorkspace.id]: (prev[activeWorkspace.id] || []).filter(c => c._id !== conversationId),
        }));
        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
          showGreetingMessage();
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    showGreetingMessage();
  };

  const handleTestModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const userMessages = useMemo(() => messages.filter(msg => msg.sender === 'user').slice(-50), [messages]);

  const renderActiveView = () => {
    const viewType = activeView.split('-').pop();

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
                  language={language}
                />;
    }
  }

  return (
    <div 
      className={`d-flex flex-column ai-page ${selectedGradientType === 'animated' ? 'animated-background-on' : ''} ${selectedGradientType === 'gradient' ? 'gradient-text' : ''} ${hasGradient ? 'gradient-active' : ''}`}
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
      {selectedBackground === 'floatingSquares' && (
        <div className="ai-page-background">
          <FloatingSquares theme={theme} />
        </div>
      )}
      {selectedBackground === 'waveAnimation' && (
        <div className="ai-page-background">
          <SvgAnimation />
        </div>
      )}
      {selectedBackground === 'movingSquares' && (
        <div className="ai-page-background">
          <MovingSquares />
        </div>
      )}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleNavbar={toggleNavbar}
        toggleProfileNavbar={toggleProfileNavbar}
        selectedModel={selectedModel}
        handleModelChange={handleModelChange}
        language={language}
        onLanguageChange={handleLanguageChange}
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
            getWorkspaces={getWorkspaces}
          />
        </div>
        <div className="d-flex flex-column flex-grow-1 idk" style={{ overflow: 'hidden' }}>
          {renderActiveView()}
        </div>
        <div className={`history-navbar-container ${isHistoryNavbarVisible ? 'visible' : ''}`}>
          <HistoryNavbar conversations={activeWorkspace ? conversationsByWorkspace[activeWorkspace.id] : []} onSelectConversation={handleSelectConversation} onDeleteConversation={handleDeleteConversation} onClose={toggleHistoryNavbar} activeConversationId={activeConversationId} />
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
              isGradientAnimated={isGradientAnimated}
              onGradientAnimationToggle={handleGradientAnimationToggle}
              selectedBackground={selectedBackground}
              onBackgroundChange={handleBackgroundChange}
              user={user} // Pass user object
              darkBackgroundColor={darkBackgroundColor}
              onDarkBackgroundColorChange={handleDarkBackgroundColorChange}
              lightBackgroundColor={lightBackgroundColor}
              onLightBackgroundColorChange={handleLightBackgroundColorChange}
              gradientBackgroundColor1={gradientBackgroundColor1}
              onGradientBackgroundColor1Change={handleGradientBackgroundColor1Change}
              gradientBackgroundColor2={gradientBackgroundColor2}
              onGradientBackgroundColor2Change={handleGradientBackgroundColor2Change}
              isGradientBackgroundColor1Enabled={isGradientBackgroundColor1Enabled}
              onGradientBackgroundColor1Toggle={handleGradientBackgroundColor1Toggle}
              isGradientBackgroundColor2Enabled={isGradientBackgroundColor2Enabled}
              onGradientBackgroundColor2Toggle={handleGradientBackgroundColor2Toggle}
              gradientDirection={gradientDirection}
              onGradientDirectionChange={handleGradientDirectionChange}
              isGradientBackgroundAnimated={isGradientBackgroundAnimated}
              onGradientBackgroundAnimationToggle={handleGradientBackgroundAnimationToggle}
              onRevertAccentGradient={handleRevertAccentGradient}
              onRevertBackgroundGradient={handleRevertBackgroundGradient}
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
