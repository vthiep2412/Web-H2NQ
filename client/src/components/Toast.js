import React, { useEffect, useRef } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }, 3500); // Auto-dismiss after 3.5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-timer-bar"></div>
      <button 
        className="toast-close-btn" 
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
