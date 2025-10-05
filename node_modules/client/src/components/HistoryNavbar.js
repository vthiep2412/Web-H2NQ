
import React from 'react';
import './HistoryNavbar.css';
import { X } from 'react-bootstrap-icons'; // Import the X icon

const HistoryNavbar = ({ conversations, onSelectConversation, onDeleteConversation, onClose }) => {
  return (
    <nav className="history-navbar">
      <div className="history-header">
        <h5>Conversation History</h5>
        <button className="close-button" onClick={onClose}><X size={20} /></button>
      </div>
      <div className="history-list">
        {conversations && conversations.map(convo => (
          <div key={convo._id} className="history-item">
            <span onClick={() => onSelectConversation(convo._id)}>{convo.title}</span>
            <button onClick={() => onDeleteConversation(convo._id)}>&times;</button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default HistoryNavbar;
