import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TypingEffect = React.memo(({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const splitWords = text.split(' ');
    setWords(splitWords);
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      const wordCount = words.length;
      const baseDelay = 10;
      const delayReduction = Math.floor(wordCount / 100) * 2;
      const finalDelay = Math.max(2, baseDelay - delayReduction);

      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + (currentIndex > 0 ? ' ' : '') + words[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, finalDelay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, words]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeText = String(children).replace(/\n$/, '');

          return !inline ? (
            <div className="code-block-container">
              {match && (
                <div className="code-block-header">
                  <span className="code-block-language">{match[1]}</span>
                  <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(codeText)}>
                    <i className="bi bi-clipboard"></i>
                  </Button>
                </div>
              )}
              <SyntaxHighlighter style={atomDark} language={match ? match[1] : ''} PreTag="div" {...props}>
                {codeText}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
});

export default TypingEffect;
