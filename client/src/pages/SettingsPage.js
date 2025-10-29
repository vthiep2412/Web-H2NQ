// Happy coding :D
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { InfoCircle, ArrowCounterclockwise } from 'react-bootstrap-icons';
import './SettingsPage.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

const SettingsPage = React.memo(() => {
  const { user, updateUser } = useAuth();
  const [aiTemperature, setAiTemperature] = useState(user?.settings?.temperature !== undefined ? user.settings.temperature : 1);
  const [thinkToggle, setThinkToggle] = useState(user?.settings?.thinking !== undefined ? user.settings.thinking : true);

  const saveSettings = useCallback(debounce(async (temp, think) => {
    try {
      const response = await axios.post('/api/settings', {
        temperature: temp,
        thinking: think,
      });
      if (response.data.user) {
        updateUser(response.data.user);
      }
      console.log('Settings saved automatically.');
    } catch (error) {
      console.error('Error saving settings automatically:', error);
    }
  }, 500), [updateUser]); // Debounce for 500ms

  useEffect(() => {
    saveSettings(aiTemperature, thinkToggle);
  }, [aiTemperature, thinkToggle, saveSettings]);

  const resetTemperature = () => {
    setAiTemperature(1);
  };

  const handleTemperatureChange = (event) => {
    setAiTemperature(parseFloat(event.target.value));
  };

  const handleThinkToggle = (event) => {
    setThinkToggle(event.target.checked);
  };

  const renderTooltip = (text) => (
    <Tooltip id="tooltip">
      {text}
    </Tooltip>
  );

  return (
    <div className="settings-page-container p-4">
      <h1>Settings</h1>

      <div className="settings-grid">
        <div className="ai-settings-section">
          <h2>AI Settings</h2>

          {/* AI Temperature Control */}
          <div className="setting-item">
            <div className="d-flex align-items-center mb-2">
              <h5 className="mb-0">AI Temperature</h5>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Controls the randomness of AI responses. Lower values produce more focused and deterministic responses, while higher values result in more creative and diverse outputs.')}
              >
                <Button variant="link" className="info-button">
                  <InfoCircle size={16} />
                </Button>
              </OverlayTrigger>
            </div>
            <div id="ai-temperature">
              <Form.Range
                min="0"
                max="2"
                step="0.1"
                value={aiTemperature}
                onChange={handleTemperatureChange}
                className="w-75"
              />
              <span className="ms-2">{aiTemperature.toFixed(1)}</span>
              <Button
                variant="link"
                onClick={resetTemperature}
                title="Revert to default"
                className="reset-button ms-3"
              >
                <ArrowCounterclockwise size={20} />
            </Button>
            </div>
          </div>

          {/* Think Toggle */}
          <div className="setting-item mt-4">
            <div className="d-flex align-items-center mb-2">
              <h5>Think Mode</h5>
              <Form.Check
                type="switch"
                id="think-toggle-switch"
                checked={thinkToggle}
                onChange={handleThinkToggle}
              />
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Enable AI thinking for potentially better results.')}
              >
                <Button variant="link" className="info-button">
                  <InfoCircle size={16} />
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SettingsPage;