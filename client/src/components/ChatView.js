import React, { useRef } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { Robot, Paperclip, SendFill, PersonCircle, Camera } from 'react-bootstrap-icons';
import TypingEffect from './TypingEffect';
import ChatInput from './ChatInput';

const ChatView = React.memo(({ messages, selectedModel, messagesEndRef, onSubmit }) => {
  return (
    <>
      <main className="flex-grow-1 chat-main-view">
        <Container>
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={`${msg.sender}-${index}-${msg.text.length}`} className={`message-bubble-container ${msg.sender}`}>
                {msg.sender === 'ai' && <div className="ai-avatar"><Robot size={20} /></div>}
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.type === 'loading' ? (
                    <div className="loading-spinner"></div>
                  ) : msg.sender === 'ai' ? (
                    <TypingEffect text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.sender === 'ai' && msg.model && <div className="model-name">{msg.model}</div>}

                {msg.sender === 'user' && <div className="user-avatar"><PersonCircle size={20} /></div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </Container>
      </main>
      <footer className="p-3 chat-footer">
        <Container>
          <ChatInput selectedModel={selectedModel} onSubmit={onSubmit} />
        </Container>
      </footer>
    </>
  );
});

export default ChatView;
