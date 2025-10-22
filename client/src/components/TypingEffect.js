import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'; // Import remarkMath
import rehypeKatex from 'rehype-katex'; // Import rehypeKatex
import 'katex/dist/katex.min.css'; // Import KaTeX styling

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const cleanMarkdown = (text) => {
  return text
    .replace(/\n{2,}/g, '\n\n') // Ensure paragraph breaks
    .replace(/([^\n])\n([^\n])/g, '$1  \n$2'); // Add line breaks for single newlines
};

const TypingEffect = React.memo(({ text, isNew, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout when props change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isNew) {
      setDisplayedText(cleanMarkdown(text)); // Apply cleanMarkdown here
      setWords([]);
      setCurrentIndex(0);
      return;
    }

    const cleanedText = cleanMarkdown(text); // Apply cleanMarkdown here
    const splitWords = cleanedText.split(/\s+/).filter(Boolean);
    setWords(splitWords);
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, isNew]);

  useEffect(() => {
    if (!isNew) {
      return;
    }

    if (words.length > 0 && currentIndex < words.length) {
      const wordCount = words.length;
      const baseDelay = 10;
      const delayReduction = Math.floor(wordCount / 100) * 2;
      const finalDelay = Math.max(2, baseDelay - delayReduction);

      timeoutRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + (currentIndex > 0 ? ' ' : '') + words[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, finalDelay);

      return () => clearTimeout(timeoutRef.current);
    } else if (isNew && currentIndex === words.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, words, isNew, onComplete]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeText = String(children).replace(/\n$/, '');

          return !inline ? (
            <div className="code-block-container">
              {match && (
                <div className="code-block-header">
                  <span className="code-block-language">{match[1]}</span>
                  <Button variant="secondary" onClick={() => navigator.clipboard.writeText(codeText)}>
                    <Clipboard />
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
