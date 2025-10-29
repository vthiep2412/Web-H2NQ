// Happy coding :D!
// Happy coding :D

import React from 'react';
import './HistoryNavbar.css';
import { X } from 'react-bootstrap-icons'; // Import the X icon
import { useTranslation } from 'react-i18next';

const HistoryNavbar = ({ conversations, onSelectConversation, onDeleteConversation, onClose, activeConversationId }) => {
  const { t } = useTranslation();

  return (
    <nav className="history-navbar">
      <div className="history-header">
        <h5>{t('conversationHistory')}</h5>
        <button className="close-button" onClick={onClose}><X size={20} /></button>
      </div>
      <div className="history-list">
        {conversations && conversations.map(convo => (
          <div key={convo._id} className={`history-item ${convo._id === activeConversationId ? 'active' : ''}`}>
            <span onClick={() => onSelectConversation(convo._id)}>{convo.title}</span>
            <button onClick={() => onDeleteConversation(convo._id)}>&times;</button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default HistoryNavbar;
