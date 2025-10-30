// Happy coding :D!
// Happy coding :D
import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Paperclip, SendFill, Camera, PlusCircle, Trash, FileEarmark } from 'react-bootstrap-icons';
import TextareaAutosize from 'react-textarea-autosize';
import { getLabelForModel } from '../utils/models';
import { useTranslation } from 'react-i18next';

const ChatInput = React.memo(({ selectedModel, onSubmit, onLocalChat, userMessages, onNewConversation, onTestModal }) => {
  const [input, setInput] = useState('');
  const fileInputRef = React.useRef(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]); // Changed to an array for multiple files
  const { t } = useTranslation();
  let modelLabel = getLabelForModel(selectedModel, t)
  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/')); // Get all selected image files
    if (files.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]); // Add new files to the array
      e.target.value = null; // Clear the input so the same file can be selected again
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleCameraClick = () => {
    // Handle camera logic here
    console.log('Camera button clicked');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (trimmedInput || selectedFiles.length > 0) {
      onSubmit(trimmedInput, selectedFiles); // Pass the array of selected files
      setInput('');
      setSelectedFiles([]); // Clear selected files after submission
      setHistoryIndex(-1);
      setTempInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (userMessages.length > 0) {
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
        if (historyIndex === userMessages.length - 1) {
          setHistoryIndex(-1);
          setInput(tempInput);
        } else {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(userMessages[newIndex].text);
        }
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const textareaStyle = {
    resize: 'none',
    flexGrow: 1,
    overflow: input ? 'auto' : 'hidden',
  };

  const isImage = (file) => file.type.startsWith('image/');

  return (
    <Form onSubmit={handleSubmit}>
      <div className={`chat-input-container ${selectedFiles.length > 0 ? 'file-selected' : ''}`}>
        {selectedFiles.length > 0 && (
          <div className="selected-files-preview-container">
            {selectedFiles.map((file, index) => (
              <div key={index} className="selected-file-preview">
                <Button variant="danger" size="sm" className="remove-file-btn" onClick={() => handleRemoveFile(index)}>
                  <Trash />
                </Button>
                {isImage(file) ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} className="file-preview-image" />
                ) : (
                  <div className="file-icon-container">
                    <FileEarmark size={24} />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <InputGroup className="chat-input-group">
          <Button variant="secondary" className="attach-btn"onClick={onNewConversation} style={{ borderTopLeftRadius: '50px',borderBottomLeftRadius: '50px' }}>
            <PlusCircle />
          </Button>
          <Button variant="secondary" className="attach-btn"onClick={handleAttachClick}>
            <Paperclip />
          </Button>
          <Button variant="secondary" className="attach-btn d-lg-none"onClick={handleCameraClick}>
            <Camera />
          </Button>
          <Form.Control
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple // Allow multiple file selection
          />
          <TextareaAutosize
            minRows={1}
            maxRows={2}
            // placeholder={`Message ${getLabelForModel(selectedModel, t)}...`}
            placeholder={t('messagePlaceholder', { modelLabel })}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="form-control chat-input chat-textarea"
            style={textareaStyle} />
          <Button variant="primary" type="submit" className="send-btn" style={{
borderTopRightRadius: '50px', borderBottomRightRadius: '50px' }}>
            <SendFill />
          </Button>
        </InputGroup>
      </div>
    </Form>
  );
});

export default ChatInput;