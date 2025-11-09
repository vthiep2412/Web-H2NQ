import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { SendFill, Camera, Plus, Paperclip, Trash, FileEarmark, FileEarmarkPdf, FileEarmarkWord, FileEarmarkPpt, FileEarmarkExcel, FileEarmarkZip } from 'react-bootstrap-icons';
import TextareaAutosize from 'react-textarea-autosize';
import { useTranslation } from 'react-i18next';
import useIsMobile from '../hooks/useIsMobile';
import './ChatInput.css';

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


const ChatInput = React.memo(({ selectedModel, onSubmit, onLocalChat, userMessages, onNewConversation, onTestModal }) => {
  const [input, setInput] = useState('');
  const fileInputRef = React.useRef(null);
  const textareaRef = React.useRef(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const hasText = input.trim().length > 0;
  const hasFiles = selectedFiles.length > 0;

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
    // Allow any file type
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      e.target.value = null;
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleCameraClick = () => {
    console.log('Camera button clicked');
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      e.preventDefault();
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasText || hasFiles) {
      onSubmit(input.trim(), selectedFiles);
      setInput('');
      setSelectedFiles([]);
      setHistoryIndex(-1);
      setTempInput('');
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
            className={`action-button send-button ${((hasText || hasFiles) || !isMobile) ? 'is-visible' : ''}`}
            disabled={!hasText && !hasFiles}
          >
            <SendFill size={24} />
          </Button>
        </div>
      </div>
    </Form>
  );
});

export default ChatInput;