import React from 'react';
import { Container } from 'react-bootstrap';
import { Robot, PersonCircle } from 'react-bootstrap-icons';
import ChatInput from './ChatInput';
import { getLabelForModel } from '../utils/models';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // ✅ Required for KaTeX styling
import '../App.css';

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds.toFixed(1)} seconds`;
};

const cleanMarkdown = (text) => {
  return text
    .replace(/\n{2,}/g, '\n\n') // Ensure paragraph breaks
    .replace(/([^\n])\n([^\n])/g, '$1  \n$2'); // Add line breaks for single newlines
};

const ChatView = React.memo(({ messages, selectedModel, messagesEndRef, onSubmit, onLocalChat, timer, isNavbarVisible, userMessages, toggleHistoryNavbar, onNewConversation, onTestModal, onTypingComplete, language }) => {
  return (
    <>
      <main className="flex-grow-1 chat-main-view">
        <Container>
          <div className="message-list">
            {messages.map((msg, index) => {
              const aiMessageBubbleStyle = {
                maxWidth: isNavbarVisible ? 'calc(72vw - 268px)' : '72vw',
              };

              return (
                <div key={`${msg.sender}-${index}-${msg.text?.length ?? 0}`} className={`message-bubble-container ${msg.sender}`}>
                  {msg.sender === 'ai' && <div className="ai-avatar"><Robot size={20} /></div>}
                  <div className={msg.sender === 'ai' ? 'ai-message-content' : ''}>
                    {msg.sender === 'ai' && msg.thinkingTime && (
                      <div className="model-name">Done thinking in {formatTime(msg.thinkingTime)}.</div>
                    )}
                    {msg.sender === 'ai' && msg.thoughts?.length > 0 && (
                      <details className="thought-box">
                        <summary>Show Thoughts</summary>
                        <div className="thoughts-container">
                          {msg.thoughts.map((thought, i) => (
                            <div key={i} className="individual-thought-box">
                              {thought.thought && (
                                <p>
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{thought.thought}</ReactMarkdown>
                                </p>
                              )}
                              {thought.functionCall && (
                                <p>Function Call: <pre>{JSON.stringify(thought.functionCall, null, 2)}</pre></p>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                    <div className={`message-bubble ${msg.sender} ${msg.type === 'error' ? 'error-bubble' : ''}`} style={msg.sender === 'ai' ? aiMessageBubbleStyle : {}}>
                      {msg.type === 'loading' ? (
                        <div className="loading-container">
                          <span className="thinking-text">Thinking</span>
                          <span className="thinking-dots" style={{ marginBottom: '1rem' }}><span>.</span><span>.</span><span>...</span></span>
                          <span style={{ marginBottom: '1rem' }}>{timer.toFixed(1)}s</span>
                        </div>
                      ) : msg.sender === 'ai' ? (
                        <div className="markdown-content">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {cleanMarkdown(msg.text)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="message-text">{msg.text}</div>
                      )}
                    </div>
                    {msg.sender === 'ai' && msg.model && (
                      <div className="model-name">{getLabelForModel(msg.model)}</div>
                    )}
                  </div>
                  {msg.sender === 'user' && <div className="user-avatar"><PersonCircle size={20} /></div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </Container>
      </main>
      <footer className="p-3 chat-footer">
        <Container>
          <ChatInput
            selectedModel={selectedModel}
            onSubmit={onSubmit}
            onLocalChat={onLocalChat}
            userMessages={userMessages}
            onNewConversation={onNewConversation}
            onTestModal={onTestModal}
            language={language}
          />
        </Container>
      </footer>
    </>
  );
});

export default ChatView;