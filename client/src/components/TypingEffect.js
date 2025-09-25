import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>;
});

export default TypingEffect;