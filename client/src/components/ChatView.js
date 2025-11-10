// Happy coding :D!
// Happy coding :D
import React, { useRef, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m${minutes > 1 ? 's' : ''} ${remainingSeconds.toFixed(1)}s`;
};

const cleanMarkdown = (text) => {
  return text
    .replace(/\n{2,}/g, '\n\n') // Ensure paragraph breaks
    .replace(/([^\n])\n([^\n])/g, '$1  \n$2'); // Add line breaks for single newlines
};

const ChatView = React.memo(({ messages, selectedModel, messagesEndRef, onSubmit, onLocalChat, timer, isNavbarVisible, userMessages, toggleHistoryNavbar, onNewConversation, onTestModal, onTypingComplete, language, workspaceId, user, developmentMode }) => {
  const { t } = useTranslation();

  const detailsRefs = useRef({});

  useEffect(() => {
    class DetailsAnimator {
      constructor(details) {
        this.details = details;
        this.summary = details.querySelector('summary');
        this.content = details.querySelector('.thoughts-container');
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.summary.addEventListener('click', (e) => this.onClick(e));
      }

      onClick(e) {
        e.preventDefault();
        this.details.style.overflow = 'hidden';
        if (this.isClosing || !this.details.open) {
          this.open();
        } else if (this.isExpanding || this.details.open) {
          this.shrink();
        }
      }

      shrink() {
        this.isClosing = true;
        const startHeight = `${this.details.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;

        if (this.animation) {
          this.animation.cancel();
        }

        this.animation = this.details.animate({
          height: [startHeight, endHeight]
        }, {
          duration: 300,
          easing: 'ease-out'
        });

        this.animation.onfinish = () => this.onAnimationFinish(false);
        this.animation.oncancel = () => this.isClosing = false;
      }

      open() {
        this.details.style.height = `${this.details.offsetHeight}px`;
        this.details.open = true;
        window.requestAnimationFrame(() => this.expand());
      }

      expand() {
        this.isExpanding = true;
        const startHeight = `${this.details.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        if (this.animation) {
          this.animation.cancel();
        }

        this.animation = this.details.animate({
          height: [startHeight, endHeight]
        }, {
          duration: 300,
          easing: 'ease-out'
        });
        this.animation.onfinish = () => this.onAnimationFinish(true);
        this.animation.oncancel = () => this.isExpanding = false;
      }

      onAnimationFinish(open) {
        this.details.open = open;
        this.isClosing = false;
        this.isExpanding = false;
        this.details.style.height = this.details.style.overflow = '';
      }
    }

    const detailsElements = detailsRefs.current;
    const animators = {};

    Object.keys(detailsElements).forEach(key => {
      const details = detailsElements[key];
      if (details && !details.animator) {
        animators[key] = new DetailsAnimator(details);
        details.animator = true;
      }
    });

  }, [messages]);

  return (
    <>
      <main className="flex-grow-1 chat-main-view">
        <Container>
          <div className="message-list">
            {messages.map((msg, index) => {
              const aiMessageBubbleStyle = {
                maxWidth: isNavbarVisible ? 'calc(60vw - 268px)' : '60vw',
              };

              return (
                <div key={msg.id || index} className={`message-bubble-container ${msg.sender}`}>
                  {/* {msg.sender === 'user' && msg.imageUrls && msg.imageUrls.length > 0 && (
                    <div className="message-images" style={{ marginBottom: '10px', textAlign: 'right' }}>
                      {msg.imageUrls.map((url, i) => (
                        <img key={i} src={url} alt={`user upload ${i}`} style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginLeft: '8px' }} />
                      ))}
                    </div>
                  )} */}
                  {msg.sender === 'ai' && <div className="ai-avatar"><Robot size={20} /></div>}
                  <div className={msg.sender === 'ai' ? 'ai-message-content' : 'user-message-content'}>
                    {msg.sender === 'ai' && msg.thinkingTime && (
                      <div className="model-name">{t('doneThinkingIn', { time: formatTime(msg.thinkingTime) })}</div>
                    )}
                    {msg.sender === 'user' && msg.imageUrls && msg.imageUrls.length > 0 && (
                      <div className="message-images" style={{ marginBottom: '10px', textAlign: 'right' }}>
                        {msg.imageUrls.map((url, i) => (
                          <img key={i} src={url} alt={`user upload ${i}`} style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginLeft: '8px' }} />
                        ))}
                      </div>
                    )}
                    {msg.sender === 'ai' && msg.thoughts?.length > 0 && (
                      <details
                        ref={el => { if (el) detailsRefs.current[msg.id || index] = el; }}
                        className="thought-box"
                      >
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
                          <span className="thinking-dots"><span>.</span><span>.</span><span>...</span></span>
                          <span >{timer.toFixed(1)}s</span>
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
                      <div className="model-name">{getLabelForModel(msg.model, t)}</div>
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
            workspaceId={workspaceId}
            user={user}
            developmentMode={developmentMode}
          />
        </Container>
      </footer>
    </>
  );
});

export default ChatView;