import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Paperclip, SendFill, Camera, PlusCircle } from 'react-bootstrap-icons';
import TextareaAutosize from 'react-textarea-autosize';
import { getLabelForModel } from '../utils/models';

const ChatInput = React.memo(({ selectedModel, onSubmit, onLocalChat, userMessages, onNewConversation, onTestModal }) => {
  const [input, setInput] = useState('');
  const fileInputRef = React.useRef(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState('');
  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      // Handle file upload logic here
    }
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
    } else if (trimmedInput) {
      onSubmit(trimmedInput);
      setInput('');
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

  return (
    <Form onSubmit={handleSubmit}>
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
        />
        <TextareaAutosize
          minRows={1}
          maxRows={2}
          placeholder={`Message ${getLabelForModel(selectedModel)}...`}
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
    </Form>
  );
});

export default ChatInput;