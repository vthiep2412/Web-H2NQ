import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Paperclip, SendFill, Camera } from 'react-bootstrap-icons';
import TextareaAutosize from 'react-textarea-autosize';
import { getLabelForModel } from '../utils/models';

function ChatInput({ selectedModel, onSubmit }) {
  const [input, setInput] = useState('');
  const fileInputRef = React.useRef(null);

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
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
        <Button variant="secondary" className="attach-btn" onClick={handleAttachClick} style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}>
          <Paperclip />
        </Button>
        <Button variant="secondary" className="attach-btn d-lg-none" onClick={handleCameraClick}>
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
        <Button variant="primary" type="submit" className="send-btn" style={{ borderTopRightRadius: '50px', borderBottomRightRadius: '50px' }}>
          <SendFill />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default ChatInput;