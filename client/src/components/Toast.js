import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500); // Auto-dismiss after 4 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-timer-bar"></div>
      <button className="toast-close-btn" onClick={onClose}>
        &times;
      </button>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
