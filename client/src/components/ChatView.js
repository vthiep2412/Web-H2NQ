import React, { useRef } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { Robot, Paperclip, SendFill, PersonCircle, Camera } from 'react-bootstrap-icons';

function ChatView({ messages, input, handleInputChange, handleSubmit, messagesEndRef, selectedModel }) {
  const fileInputRef = useRef(null);

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

  return (
    <>
      <main className="flex-grow-1 chat-main-view">
        <Container>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble-container ${msg.sender}`}>
                {msg.sender === 'ai' && <div className="ai-avatar"><Robot size={20} /></div>}
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && <div className="user-avatar"><PersonCircle size={20} /></div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </Container>
      </main>
      <footer className="p-3 chat-footer">
        <Container>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="chat-input-group">
              <Button variant="secondary" className="attach-btn" onClick={handleAttachClick}>
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
              <Form.Control
                type="text"
                placeholder={`Message ${selectedModel}...`}
                value={input}
                onChange={handleInputChange}
                className="chat-input"
              />
              <Button variant="primary" type="submit" className="send-btn">
                <SendFill />
              </Button>
            </InputGroup>
          </Form>
        </Container>
      </footer>
    </>
  );
}

export default ChatView;
