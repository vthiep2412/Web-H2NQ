// Happy coding :D!
// Happy coding :D
import React from 'react';
import './FloatingSquares.css';

const FloatingSquares = ({ theme }) => {
  return (
    <div className="squares-background">
      <ul className={`squares ${theme === 'light' ? 'squares-dark' : ''}`}>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default FloatingSquares;
