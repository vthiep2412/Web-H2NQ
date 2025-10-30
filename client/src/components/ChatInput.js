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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    let imageUrls = [];

    if (selectedFiles.length > 0) {
      imageUrls = await uploadImagesToCloudinary(selectedFiles);
    }

    if (trimmedInput.startsWith('/chat')) {
      const regex = /^\/chat\s+"(.*?)"\s+"(ai|me)"$/;
      const match = trimmedInput.match(regex);

      if (match) {
        const message = match[1];
        const sender = match[2];
        onLocalChat(message, sender === 'me' ? 'user' : 'ai');
        setInput('');
      } else {
        // Handle invalid command format
        const errorMessage = 'Invalid /chat command format. Use /chat "[message]" "[ai/me]"';
        console.error(errorMessage);
        onLocalChat(errorMessage, 'ai');
      }
    } else if (trimmedInput === '/testmodal') {
      onTestModal();
      setInput('');
    } else if (trimmedInput || imageUrls.length > 0) {
      onSubmit(trimmedInput, imageUrls); // Pass the array of selected files
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