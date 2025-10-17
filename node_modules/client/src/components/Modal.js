import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, children, theme }) => {
  if (!show) {
    return null;
  }

  const contentThemeClass = theme === 'dark' ? 'modal-content-dark' : 'modal-content-light';

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${contentThemeClass}`}>
        {children}
        <button onClick={onClose} className="btn btn-primary mt-3">Close</button>
      </div>
    </div>
  );
};

export default Modal;