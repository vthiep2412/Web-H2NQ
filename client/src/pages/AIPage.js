// Happy coding :D!
// Happy coding :D
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import Header from '../components/Header';
import WorkspaceNavbar from '../components/WorkspaceNavbar';
import ProfileNavbar from '../components/ProfileNavbar'; // New
import ChatView from '../components/ChatView';
import IDEPage from './IDEPage';
import StoragePage from './StoragePage';
import AIMemoryPage from './AIMemoryPage';
import SettingsPage from './SettingsPage';
import useWorkspaces from '../hooks/useWorkspaces';
import LiquidBackground from '../components/LiquidBackground';
import GradientAnimation from '../components/GradientAnimation';
import FloatingSquares from '../components/FloatingSquares';
import SvgAnimation from '../components/SvgAnimation';
import MovingSquares from '../components/MovingSquares';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useToast } from '../context/ToastContext'; // Import useToast
import HistoryNavbar from '../components/HistoryNavbar';
import { useTranslation } from 'react-i18next';
import Modal from '../components/Modal';
import { getLabelForModel } from '../utils/models'; // Import getLabelForModel
import '../App.css';
import './AIPage.css';
import '../gradient.css';

const hexToRgba = (hex, alpha) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return hex; // Return original if not a valid hex
  }
  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
};

const uploadImagesToCloudinary = async (files) => {
  const uploaders = files.map(async (file) => {
    // 1. Get signature from backend
    const token = localStorage.getItem('token');
    const sigRes = await fetch('/api/messages/image-signature', {
      method: 'POST',
      headers: {
        'x-auth-token': token,
      },
    });

    if (!sigRes.ok) {
      throw new Error('Failed to get upload signature');
    }

    const { timestamp, signature, upload_preset, transformation } = await sigRes.json();

    // 2. Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('upload_preset', upload_preset);
    formData.append('transformation', transformation);
    formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY);

    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const uploadRes = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const uploadData = await uploadRes.json();
    return uploadData.secure_url;
  });

  return await Promise.all(uploaders);
};

function AIPage() {

  const { t, i18n } = useTranslation();
  const { user, logout, updateUser } = useAuth(); // Get user and logout from AuthContext
  const { addToast } = useToast(); // Get addToast from useToast 

  // UI State
  const [theme, setTheme] = useState(user?.settings?.theme || 'dark');
  const [language, setLanguage] = useState(user?.settings?.language || 'en');
  const [isNavbarVisible, setIsNavbarVisible] = useState(window.innerWidth >= 800);
  const [isProfileNavbarVisible, setIsProfileNavbarVisible] = useState(false);
  const [isHistoryNavbarVisible, setIsHistoryNavbarVisible] = useState(false); // New state for history navbar

  const [activeView, setActiveView] = useState('chat1');
  const navbarRef = useRef(null);

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
  const [aiTemperature, setAiTemperature] = useState(user?.settings?.temperature !== undefined ? user.settings.temperature : 1);
  const [thinkToggle, setThinkToggle] = useState(user?.settings?.thinking !== undefined ? user.settings.thinking : true);
  const [developmentMode, setDevelopmentMode] = useState(() => {
    const savedDevMode = localStorage.getItem('developmentMode');
    if (savedDevMode !== null) {
      return JSON.parse(savedDevMode);
    }
    return false;
  });

  // Workspace State
  const { workspaces, addWorkspace, editWorkspace, deleteWorkspace, updateWorkspaceMemories, getWorkspaces, updateLastActiveWorkspace } = useWorkspaces();

  // AI Memory State
  const activeWorkspace = useMemo(() => {
    if (!activeView) return null;
    const workspaceId = activeView.split('-')[0];
    return workspaces.find(ws => ws.id === workspaceId);
  }, [workspaces, activeView]);
  const memories = activeWorkspace ? activeWorkspace.memories : [];

  // Model State
  const [selectedModel, setSelectedModel] = useState(user?.settings?.selectedModel || 'gemini-flash-latest');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [conversationsByWorkspace, setConversationsByWorkspace] = useState({}); // Changed to object
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [testModalMessage, setTestModalMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [shouldFetchConversations, setShouldFetchConversations] = useState(false); // New state

  // Cleanup old local storage on initial load
  useEffect(() => {
    const cleanupOldLocalStorage = () => {
      const oneDay = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const activeWorkspaceId = localStorage.getItem('lastActiveWorkspace');

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('chatInput-')) {
          const workspaceId = key.substring('chatInput-'.length);
          
          // Don't clean up the currently active workspace
          if (workspaceId === activeWorkspaceId) {
            continue;
          }

          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data && data.timestamp && (now - data.timestamp > oneDay)) {
              console.log(`Cleaning up old localStorage for workspace: ${workspaceId}`);
              // Remove the main chat input entry
              localStorage.removeItem(key);
              // Remove associated images
              if (data.files && Array.isArray(data.files)) {
                data.files.forEach(file => {
                  if (file.type && file.type.startsWith('image/')) {
                    localStorage.removeItem(`chatImage-${workspaceId}-${file.name}`);
                  }
                });
              }
            }
          } catch (e) {
            console.error(`Failed to parse or cleanup localStorage key: ${key}`, e);
            // If parsing fails, it might be corrupted data, so we could remove it
            localStorage.removeItem(key);
          }
        }
      }
    };

    cleanupOldLocalStorage();
  }, []); // Runs only once on mount

  useEffect(() => {
    const savedSelectedModel = localStorage.getItem('selectedModel');
    if (savedSelectedModel) setSelectedModel(savedSelectedModel);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);


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
        temperature: aiTemperature,
        thinking: thinkToggle,
        developmentMode,
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
              } else {        console.error('Failed to save settings:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [updateUser, 
    theme, 
    customTheme.primaryColor, 
    gradientColor1, 
    gradientColor2, 
    isGradientColor1Enabled,
    isGradientColor2Enabled,
    isGradientAnimated,
    selectedModel,
    selectedBackground,
    language,
    activeWorkspace,
    darkBackgroundColor,
    lightBackgroundColor,
    gradientBackgroundColor1, 
    gradientBackgroundColor2, 
    isGradientBackgroundColor1Enabled, 
    isGradientBackgroundColor2Enabled, 
    gradientDirection, 
    aiTemperature,
    thinkToggle,
    developmentMode
  ]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      saveSettings();
      localStorage.setItem('developmentMode', JSON.stringify(developmentMode));
    }
  }, [saveSettings, developmentMode]);

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

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
    if(window.innerWidth < 800){
      setIsProfileNavbarVisible(false);
      setIsHistoryNavbarVisible(false);
    }
  };

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
    body.style.backgroundColor = theme === 'dark' ? darkBackgroundColor : lightBackgroundColor;
    return () => {
      body.style.backgroundColor = '';
    };
  }, [theme, darkBackgroundColor, lightBackgroundColor]);

  // Handles accent color gradient animation
  useEffect(() => {
    if (isGradientAnimated) {
      document.body.classList.add('gradient-animated');
    } else {
      document.body.classList.remove('gradient-animated');
    }
    return () => {
      document.body.classList.remove('gradient-animated');
    };
  }, [isGradientAnimated]);


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
            id: msg._id,
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: msg.thinkingTime,
            thoughts: msg.thoughts,
            imageUrls: msg.imageUrls,
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
            id: msg._id,
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: msg.thinkingTime,
            thoughts: msg.thoughts,
            imageUrls: msg.imageUrls,
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
  }, [userId, activeWorkspace, showGreetingMessage, user, conversationsByWorkspace]);

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

  const scrollToBottom = (snapPercentage = 0) => {
    const el = document.querySelector('.chat-main-view');
    if (el) {
      const destination = el.scrollHeight;

      // For short scrolls or when no snap is needed, just do a normal smooth scroll.
      if (snapPercentage <= 0) {
        el.scrollTo({ top: destination, behavior: 'smooth' });
        return;
      }

      const currentPosition = el.scrollTop;
      const clientHeight = el.clientHeight;
      const distanceToTravel = destination - clientHeight - currentPosition;

      if (distanceToTravel <= 0) return;

      const snapAmount = distanceToTravel * snapPercentage;
      const snapPosition = currentPosition + snapAmount;

      el.scrollTo({
        top: snapPosition,
        behavior: 'auto',
      });

      requestAnimationFrame(() => {
        el.scrollTo({
          top: destination,
          behavior: 'smooth',
        });
      });
    }
  };

  useEffect(() => {
    const messageCount = messages.length;
    let snapPercentage = 0;

    if (messageCount > 50) { // Extra Long
      snapPercentage = 0.90;
    } else if (messageCount > 30) { // Long
      snapPercentage = 0.80;
    } else if (messageCount > 15) { // Medium
      snapPercentage = 0.60;
    } else if (messageCount > 10) { // Small
      snapPercentage = 0.40;
    }

    scrollToBottom(snapPercentage);
  }, [messages]);
  // Handlers
  const handleSubmit = async (message, files = []) => {
    if (message.trim() || files.length > 0) {
      const frontendStartTime = Date.now();

      // Create local object URLs for immediate UI update
      const localImageUrls = files.map(file => URL.createObjectURL(file));
      const userMessage = { id: `user-${Date.now()}`, text: message, sender: 'user', imageUrls: localImageUrls };
      const loadingMessage = { id: 'loading', sender: 'ai', type: 'loading' };

      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Update UI immediately
      setMessages([...messages, userMessage, loadingMessage]);
      setShouldFetchConversations(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setTimer((Date.now() - frontendStartTime) / 1000);
      }, 100);

      let finalImageUrls = [];
      if (files.length > 0) {
        try {
          finalImageUrls = await uploadImagesToCloudinary(files);
          // Clean up local URLs after upload
          localImageUrls.forEach(url => URL.revokeObjectURL(url));
        } catch (error) {
          console.error('handleSubmit: Error uploading images:', error);
          clearInterval(timerRef.current);
          setTimer(0);
          const errorMessage = { text: `Error uploading images: ${error.message}`, sender: 'ai', type: 'error' };
          setMessages(prevMessages => [...prevMessages.filter(m => m.id !== 'loading'), errorMessage]);
          return;
        }
      }

      try {
        const token = localStorage.getItem('token');
        // Use finalImageUrls for the backend request
        const requestBody = JSON.stringify({ message, model: selectedModel, history: conversationHistory, conversationId: activeConversationId, memories, workspaceId: activeWorkspace.id, language, frontendStartTime, thinking: thinkToggle, imageUrls: finalImageUrls });
        const headers = {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        };

        console.log('Sending to server:', JSON.parse(requestBody));

        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: headers,
          body: requestBody,
        });

        clearInterval(timerRef.current);
        setTimer(0);

        if (!response.ok) {
          const errorData = await response.json();
          let errorMessageText = 'An unknown error occurred.';
          if (errorData.error) {
            if (typeof errorData.error === 'object' && errorData.error.message) {
              const errorCode = errorData.error.code || response.status;
              try {
                // The backend might send a stringified JSON as the message
                const innerError = JSON.parse(errorData.error.message);
                if (innerError.error && innerError.error.message) {
                  errorMessageText = `AI API Error: ${errorData.error.status} \n ${innerError.error.message} (Code ${innerError.error.code || errorCode})`;
                } else {
                  errorMessageText = `AI API Error: ${errorData.error.status} \n ${errorData.error.message} (Code ${errorCode})`;
                }
              } catch (e) {
                // If parsing fails, it's just a regular string message
                errorMessageText = `AI API Error: ${errorData.error.status} \n ${errorData.error.message} (Code ${errorCode})`;
              }
            } else {
              errorMessageText = `Error: ${errorData.error.status} \n ${errorData.error}`;
            }
          }
          const errorMessage = { text: errorMessageText, sender: 'ai', type: 'error' };
          setMessages(prevMessages => [...prevMessages.filter(m => m.id !== 'loading'), errorMessage]);
          return;
        }

        const data = await response.json();
        if (data.truncated) {
          setShowModal(true);
        }
        const aiMessage = { id: `ai-${Date.now()}`, text: data.text, sender: 'ai', model: data.model, thinkingTime: data.thinkingTime, thoughts: data.thoughts, isNew: true }; // New AI messages are new

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
            id: msg._id,
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
            model: msg.model,
            thinkingTime: data.thinkingTime, // Use backend thinking time
            thoughts: msg.thoughts,
            imageUrls: msg.imageUrls,
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
                const newMessages = [...convo.messages, { role: 'user', content: message, imageUrls: finalImageUrls }, { role: 'assistant', content: data.text, model: data.model, thinkingTime: data.thinkingTime, thoughts: data.thoughts }];
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

  const handleGradientBackgroundColor1Change = useMemo(() => debounce((color) => {
    setGradientBackgroundColor1(color);
  }, 100), []);

  const handleGradientBackgroundColor2Change = useMemo(() => debounce((color) => {
    setGradientBackgroundColor2(color);
  }, 100), []);

  const handleGradientBackgroundColor1Toggle = () => {
    setIsGradientBackgroundColor1Enabled(prev => !prev);
  };

  const handleGradientBackgroundColor2Toggle = () => {
    setIsGradientBackgroundColor2Enabled(prev => !prev);
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
  };

  const toggleProfileNavbar = () => {
    setIsProfileNavbarVisible(!isProfileNavbarVisible);
    if(window.innerWidth <= 800){
      setIsNavbarVisible(false);
    }
  };

  const toggleHistoryNavbar = () => {
    setIsHistoryNavbarVisible(!isHistoryNavbarVisible);
    if(window.innerWidth <= 800){
      setIsNavbarVisible(false);
    }
  };

  const handleGradientDirectionChange = useCallback((event) => {
    const value = event.target ? event.target.value : event;
    setGradientDirection(value);
  }, [setGradientDirection]);

  const handleModelChange = (model) => {
    setSelectedModel(model);
    if (model.startsWith('gemma')) {
      addToast(t('gemmaThinkingWarning', { modelName: getLabelForModel(model, t) }), 'warning');
    }
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    const workspaceId = viewId.split('-')[0];
    updateLastActiveWorkspace(workspaceId);
    if(window.innerWidth <= 576){
      setIsNavbarVisible(false);
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
        id: msg._id,
        sender: msg.role === 'assistant' ? 'ai' : 'user',
        text: msg.content,
        model: msg.model,
        thinkingTime: msg.thinkingTime,
        thoughts: msg.thoughts,
        imageUrls: msg.imageUrls,
        isNew: false, // Loaded messages are not new
      }));
      setMessages(mappedMessages);
      if (window.innerWidth < 576) {
        setIsHistoryNavbarVisible(false); // Close history navbar after selection
      }
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!activeWorkspace || !activeWorkspace.id) {
      console.error('No active workspace found, cannot delete conversation');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/conversations/${conversationId}?workspaceId=${activeWorkspace.id}`, {
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
    setMessages([]); // Clear messages immediately
    setTimeout(() => {
      showGreetingMessage();
    }, 0);
    // coderabbit thought this a bug! lol
  };

  const handleTestModal = useCallback(() => {
    setTestModalMessage('This is a test modal triggered by /test modal command.');
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
        return <SettingsPage 
          aiTemperature={aiTemperature} 
          setAiTemperature={setAiTemperature} 
          thinkToggle={thinkToggle} 
          setThinkToggle={setThinkToggle} 
          developmentMode={developmentMode}
          setDevelopmentMode={setDevelopmentMode}
        />;
      case 'chat':
      default:
        const chatState = { messages, userMessages, timer, activeConversationId };
        const chatConfig = { selectedModel, language, workspaceId: activeWorkspace?.id, user, developmentMode };
        const chatActions = { onSubmit: handleSubmit, onLocalChat: handleLocalChat, toggleHistoryNavbar, onNewConversation: handleNewConversation, onTestModal: handleTestModal, onTypingComplete: handleTypingComplete };
        const uiState = { isNavbarVisible, messagesEndRef };

        return <ChatView 
          chatState={chatState}
          chatConfig={chatConfig}
          chatActions={chatActions}
          uiState={uiState}
        />;
    }
  }

  return (
    <div 
      className={`d-flex flex-column ai-page ${selectedGradientType === 'animated' ? 'animated-background-on' : ''} ${selectedGradientType === 'gradient' ? 'gradient-text' : ''} ${hasGradient ? 'gradient-active' : ''}`}
    >
      {selectedBackground === 'gradientAnimation' && (
        <GradientAnimation
          primaryColor={customTheme.primaryColor}
          gradientColor1={gradientBackgroundColor1}
          gradientColor2={gradientBackgroundColor2}
          isGradientColor1Enabled={isGradientBackgroundColor1Enabled}
          isGradientColor2Enabled={isGradientBackgroundColor2Enabled}
          isAnimated={true} // Always animated when selected
          direction={gradientDirection}
        />
      )}
      {(isGradientBackgroundColor1Enabled || isGradientBackgroundColor2Enabled) && (() => {
        const colors = [];
        const baseColor = theme === 'dark' ? darkBackgroundColor : lightBackgroundColor;
        const gentleOpacity = 0.15; // Low opacity for a "gentle" effect

        if (isGradientBackgroundColor1Enabled) {
          colors.push(hexToRgba(gradientBackgroundColor1, gentleOpacity));
        }
        if (isGradientBackgroundColor2Enabled) {
          colors.push(hexToRgba(gradientBackgroundColor2, gentleOpacity));
        }

        let gradientString;

        if (colors.length === 2) {
          gradientString = `linear-gradient(${gradientDirection}, ${colors[0]} 0%, ${colors[1]} 50%, ${baseColor} 100%)`;
        } else if (colors.length === 1) {
          gradientString = `linear-gradient(${gradientDirection}, ${colors[0]} 0%, ${baseColor} 66%)`;
        } else {
          gradientString = `linear-gradient(${gradientDirection}, ${baseColor} 0%, ${baseColor} 100%)`;
        }

        return (
          <div
            className="absolute inset-0 z-[-1]"
            style={{
              background: gradientString,
            }}
          />
        );
      })()}
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
        developmentMode={developmentMode}
      />
      <div style={{ display: 'flex', flex: '1 1 auto', overflow: 'hidden' }}>
        <div ref={navbarRef} className={`workspace-navbar-container ${isNavbarVisible ? 'visible' : ''}`}>
          <WorkspaceNavbar
            activeView={activeView} 
            onViewChange={handleViewChange}
            workspaces={workspaces}
            addWorkspace={addWorkspace}
            editWorkspace={editWorkspace}
            deleteWorkspace={deleteWorkspace}
            toggleHistoryNavbar={toggleHistoryNavbar}
            isHistoryNavbarVisible={isHistoryNavbarVisible}
            // screenSizeRef={screenSizeRef}
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
              onRevertAccentGradient={handleRevertAccentGradient}
              onRevertBackgroundGradient={handleRevertBackgroundGradient}
              onGradientDirectionChange={handleGradientDirectionChange}
              setGradientDirection={setGradientDirection}
            />
          )}
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} theme={theme}>
        <p>{testModalMessage || t('conversationHistoryShortened')}</p>
      </Modal>
    </div>
  );
}
export default AIPage;