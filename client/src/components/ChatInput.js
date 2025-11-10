import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Button } from 'react-bootstrap';
import { SendFill, Camera, Plus, Paperclip, Trash, FileEarmark, FileEarmarkPdf, FileEarmarkWord, FileEarmarkPpt, FileEarmarkExcel, FileEarmarkZip } from 'react-bootstrap-icons';
import TextareaAutosize from 'react-textarea-autosize';
import { useTranslation } from 'react-i18next';
import useIsMobile from '../hooks/useIsMobile';
import { useToast } from '../context/ToastContext'; // Import useToast
import './ChatInput.css';

// Simple debounce function
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

// Helper function to get a specific icon based on file extension
const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileEarmarkPdf size={32} />;
    case 'doc':
    case 'docx':
      return <FileEarmarkWord size={32} />;
    case 'ppt':
    case 'pptx':
      return <FileEarmarkPpt size={32} />;
    case 'xls':
    case 'xlsx':
      return <FileEarmarkExcel size={32} />;
    case 'zip':
    case 'rar':
      return <FileEarmarkZip size={32} />;
    default:
      return <FileEarmark size={32} />;
  }
};

// Function to convert image to Base64 WebP
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        try {
          // Convert to WebP with 90% quality
          const webpBase64 = canvas.toDataURL('image/webp', 0.9);
          resolve(webpBase64);
        } catch (e) {
          reject(new Error('Failed to convert image to WebP.'));
        }
      };
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


const ChatInput = React.memo(({ config, actions }) => {
  const { userMessages, workspaceId, user, developmentMode } = config;
  const { onSubmit, onNewConversation, onTestModal } = actions;

  const [input, setInput] = useState('');
  const fileInputRef = React.useRef(null);
  const textareaRef = React.useRef(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [persistedFileMetadata, setPersistedFileMetadata] = useState([]); // New state for file metadata
  const [persistedImageBase64, setPersistedImageBase64] = useState({}); // New state for Base64 image data
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { addToast } = useToast(); // Use the toast hook

  const MAX_FILE_SIZE_MB = user?.tier === 'free' ? 10 : 50; // 10MB for free, 50MB for others
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const MAX_IMAGES_FREE_TIER = 10; // Max 10 images for free tier users

  const hasText = input.trim().length > 0;
  const hasFiles = selectedFiles.length > 0 || persistedFileMetadata.length > 0;

  const getLocalStorageKey = useCallback(() => `chatInput-${workspaceId}`, [workspaceId]);
  const getImageLocalStorageKey = useCallback((fileName) => `chatImage-${workspaceId}-${fileName}`, [workspaceId]);

  const saveInputToLocalStorage = useCallback(async (text, files) => {
    if (!workspaceId) return;

    const fileMetadataToSave = [];
    const imageBase64Data = {};

    for (const file of files) {
      fileMetadataToSave.push({ name: file.name, size: file.size, type: file.type });
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await convertImageToBase64(file);
          imageBase64Data[file.name] = base64;
          try {
            localStorage.setItem(getImageLocalStorageKey(file.name), base64);
          } catch (e) {
            if (e.name === 'QuotaExceededError') {
              addToast(t('imageTooBigToAutoSave', { fileName: file.name }), 'warning');
              // Don't save base64 for this image if quota exceeded
              delete imageBase64Data[file.name];
            } else {
              console.error('Error saving image to local storage:', e);
            }
          }
        } catch (e) {
          console.error('Error converting or saving image:', e);
          addToast(t('imageConversionFailed', { fileName: file.name }), 'error');
        }
      }
    }

    const dataToSave = {
      text,
      files: fileMetadataToSave,
      timestamp: Date.now(), // Add timestamp
    };
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(dataToSave));
  }, [workspaceId, getLocalStorageKey, getImageLocalStorageKey, addToast, t]);

  const debouncedSaveInput = useMemo(
    () => debounce(saveInputToLocalStorage, 1000),
    [saveInputToLocalStorage]
  );

  // Load from local storage
  useEffect(() => {
    if (!workspaceId) return;
    const savedData = localStorage.getItem(getLocalStorageKey());
    const loadedImageBase64 = {};

    if (savedData) {
      const { text, files } = JSON.parse(savedData);
      setInput(text || '');
      setPersistedFileMetadata(files || []);

      // Attempt to load Base64 data for images
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const base64 = localStorage.getItem(getImageLocalStorageKey(file.name));
          if (base64) {
            loadedImageBase64[file.name] = base64;
          }
        }
      });
      setPersistedImageBase64(loadedImageBase64);
    } else {
      setInput('');
      setPersistedFileMetadata([]);
      setPersistedImageBase64({});
    }
    setSelectedFiles([]); // Clear actual file objects on workspace change/load
  }, [workspaceId, getLocalStorageKey, getImageLocalStorageKey]);

  // Save to local storage whenever input or selectedFiles change
  useEffect(() => {
    debouncedSaveInput(input, selectedFiles);
  }, [input, selectedFiles, debouncedSaveInput]);

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        event.preventDefault();
        textareaRef.current.focus();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        // Use alert for critical blocking message (as per memory)
        alert(t('fileTooLarge', { fileName: file.name, maxSize: MAX_FILE_SIZE_MB }));
      } else if (user?.tier === 'free' && selectedFiles.length + validFiles.length >= MAX_IMAGES_FREE_TIER) {
        addToast(t('imageLimitReached', { fileName: file.name, limit: MAX_IMAGES_FREE_TIER }), 'warning');
      }
      else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
      setPersistedFileMetadata([]); // Clear persisted metadata when new files are selected
      setPersistedImageBase64({}); // Clear persisted image data
      e.target.value = null;
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemovePersistedFile = (index) => {
    const fileToRemove = persistedFileMetadata[index];
    if (fileToRemove && fileToRemove.type.startsWith('image/')) {
      localStorage.removeItem(getImageLocalStorageKey(fileToRemove.name));
      setPersistedImageBase64(prev => {
        const newState = { ...prev };
        delete newState[fileToRemove.name];
        return newState;
      });
    }
    setPersistedFileMetadata(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleCameraClick = () => {
    console.log('Camera button clicked');
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(t('fileTooLarge', { fileName: file.name, maxSize: MAX_FILE_SIZE_MB }));
          } else if (user?.tier === 'free' && selectedFiles.length + files.length >= MAX_IMAGES_FREE_TIER) {
            addToast(t('imageLimitReached', { fileName: file.name, limit: MAX_IMAGES_FREE_TIER }), 'warning');
          }
          else {
            files.push(file);
          }
        }
      }
    }
    if (files.length > 0) {
      e.preventDefault();
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      setPersistedFileMetadata([]); // Clear persisted metadata when new files are pasted
      setPersistedImageBase64({}); // Clear persisted image data
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = input.trim();

    // Developer /test command
          if (developmentMode && message.startsWith('/test')) {
          const parts = message.split(' ');
          const command = parts[1]; // Get the subcommand
          const type = parts[2]; // Get the type for toast
    
          if (command === 'modal') {
            onTestModal();
          } else if (command === 'toast') {
            if (type === 'info') {
              addToast('This is an info test toast.', 'info');
            } else if (type === 'success') {
              addToast('This is a success test toast.', 'success');
            } else if (type === 'warning') {
              addToast('This is a warning test toast.', 'warning');
            } else if (type === 'error') {
              addToast('This is an error test toast.', 'error');
            }
            else {
              addToast('This is a default test toast.', 'success');
            }
          } else {
            addToast('Usage: /test [modal|toast [info|success|warning|error]]', 'info');
          }
          setInput(''); // Clear the input
          return; // Stop further execution
        }
    if (hasText || selectedFiles.length > 0) { // Only submit if there's actual text or selected files
      onSubmit(message, selectedFiles);
      setInput('');
      setSelectedFiles([]);
      setPersistedFileMetadata([]); // Clear persisted metadata after submission
      setPersistedImageBase64({}); // Clear persisted image data after submission
      setHistoryIndex(-1);
      setTempInput('');
      localStorage.removeItem(getLocalStorageKey()); // Clear main input from local storage
      // Clear all associated image base64 data
      persistedFileMetadata.forEach(file => {
        if (file.type.startsWith('image/')) {
          localStorage.removeItem(getImageLocalStorageKey(file.name));
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (userMessages.length > 0 && historyIndex !== 0) {
        if (historyIndex === -1) {
          setTempInput(input);
          const newIndex = userMessages.length - 1;
          setHistoryIndex(newIndex);
          setInput(userMessages[newIndex].text);
        } else {
          const newIndex = Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(userMessages[newIndex].text);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        if (historyIndex < userMessages.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(userMessages[newIndex].text);
        } else {
          setHistoryIndex(-1);
          setInput(tempInput);
        }
      }
    }
  };

  const isImage = (file) => file.type.startsWith('image/');
  const isPersistedImage = (fileMetadata) => fileMetadata.type && fileMetadata.type.startsWith('image/');

  return (
    <Form onSubmit={handleSubmit} className="chat-input-redesign-container">
      <div className={`image-preview-area ${hasFiles ? 'expanded' : ''}`}>
        <div className="selected-files-preview-container">
          {selectedFiles.map((file, index) => (
            <div key={index} className="selected-file-preview">
              <Button variant="dark" size="sm" className="remove-file-btn" onClick={() => handleRemoveFile(index)}>
                <Trash size={12} />
              </Button>
              {isImage(file) ? (
                <img src={URL.createObjectURL(file)} alt={file.name} className="file-preview-image" />
              ) : (
                <div className="file-icon-container">
                  {getFileIcon(file.name)}
                  <span className="file-name-text">{file.name}</span>
                </div>
              )}
            </div>
          ))}
          {selectedFiles.length === 0 && persistedFileMetadata.map((fileMetadata, index) => (
            <div key={`persisted-${index}`} className="selected-file-preview persisted-file-preview">
              <Button variant="dark" size="sm" className="remove-file-btn" onClick={() => handleRemovePersistedFile(index)}>
                <Trash size={12} />
              </Button>
              {isPersistedImage(fileMetadata) && persistedImageBase64[fileMetadata.name] ? (
                <img src={persistedImageBase64[fileMetadata.name]} alt={fileMetadata.name} className="file-preview-image" />
              ) : (
                <div className="file-icon-container">
                  {getFileIcon(fileMetadata.name)}
                  <span className="file-name-text">{fileMetadata.name} (Lost)</span>
                </div>
              )}
              {!persistedImageBase64[fileMetadata.name] && <span className="file-status-text">{t('fileLostReattach')}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="text-area-container">
        <TextareaAutosize
          ref={textareaRef}
          minRows={1}
          maxRows={5}
          placeholder={t('messagePlaceholder')}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="chat-textarea"
        />
      </div>

      <div className="action-bar-container">
        <Button variant="secondary" className="action-button" onClick={onNewConversation}>
          <Plus size={24} />
        </Button>
        <Button variant="secondary" className="action-button" onClick={handleAttachClick}>
          <Paperclip size={24} />
        </Button>
        <Form.Control
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
        
        <div className="action-gap"></div>

        <div className="right-button-container">
          {isMobile && (
            <Button variant="secondary" className={`action-button camera-button ${(!hasText && !hasFiles) ? 'is-visible' : ''}`} onClick={handleCameraClick}>
              <Camera size={24} />
            </Button>
          )}
          <Button
            variant="primary"
            type="submit"
            className={`action-button send-button ${((hasText || selectedFiles.length > 0) || !isMobile) ? 'is-visible' : ''}`}
            disabled={!hasText && selectedFiles.length === 0}
          >
            <SendFill size={24} />
          </Button>
        </div>
      </div>
    </Form>
  );
});

export default ChatInput;