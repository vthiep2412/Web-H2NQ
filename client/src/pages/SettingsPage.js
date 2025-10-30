// Happy coding :D!
// Happy coding :D
import React, { useMemo } from 'react';
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { InfoCircle, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import './SettingsPage.css';

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

const SettingsPage = React.memo(({ aiTemperature, setAiTemperature, thinkToggle, setThinkToggle, developmentMode, setDevelopmentMode }) => {
  const { t } = useTranslation();

  const resetTemperature = () => {
    setAiTemperature(1);
  };

  const handleTemperatureChange = useMemo(() => debounce((event) => {
    setAiTemperature(parseFloat(event.target.value));
  }, 100), [setAiTemperature]);

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
      <h1>{t('settingsPageTitle')}</h1>

      <div className="settings-grid">
        <div className="ai-settings-section">
          <h2>{t('settingsPageAiSettingsTitle')}</h2>

          {/* AI Temperature Control */}
          <div className="setting-item">
            <div className="d-flex align-items-center mb-2">
              <h5 className="mb-0">{t('settingsPageAiSettingsTemperatureLabel')}</h5>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(t('settingsPageAiSettingsTemperatureTooltip'))}
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
                title={t('settingsPageAiSettingsTemperatureResetTooltip')}
                className="reset-button ms-3"
              >
                <ArrowCounterclockwise size={20} />
            </Button>
            </div>
          </div>

          {/* Think Toggle */}
          <div className="setting-item mt-4">
            <div className="d-flex align-items-center mb-2">
              <h5>{t('settingsPageAiSettingsThinkModeLabel')}</h5>
              <Form.Check
                type="switch"
                id="think-toggle-switch"
                checked={thinkToggle}
                onChange={handleThinkToggle}
              />
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(t('settingsPageAiSettingsThinkModeTooltip'))}
              >
                <Button variant="link" className="info-button">
                  <InfoCircle size={16} />
                </Button>
              </OverlayTrigger>
            </div>
          </div>

          {/* Development Mode Toggle */}
          <div className="setting-item mt-4">
            <div className="d-flex align-items-center mb-2">
              <h5>{t('settingsPageAiSettingsDevelopmentModeLabel')}</h5>
              <Form.Check
                type="switch"
                id="development-mode-toggle-switch"
                checked={developmentMode}
                onChange={(e) => setDevelopmentMode(e.target.checked)}
              />
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(t('settingsPageAiSettingsDevelopmentModeTooltip'))}
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