import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const wordCount = text.split(' ').length;
    const baseDelay = 10;
    const delayReduction = Math.floor(wordCount / 100) * 2;
    const finalDelay = Math.max(2, baseDelay - delayReduction);

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, finalDelay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

export default TypingEffect;
