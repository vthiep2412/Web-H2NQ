import React from 'react';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
import { PersonCircle, List, SunFill, MoonFill } from 'react-bootstrap-icons';
import { models, getLabelForModel } from '../utils/models';
import { useTranslation } from 'react-i18next';
import './Header.css';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
];

const Header = React.memo(({ 
  theme, 
  toggleTheme, 
  toggleNavbar, 
  toggleProfileNavbar, 
  selectedModel, 
  handleModelChange 
}) => {
  const { i18n } = useTranslation();

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <header className="app-header">
        <Row className='d-flex align-items-center'>
            <Col className="d-flex align-items-center">
                <Button variant="link" onClick={() => toggleNavbar(null)} className="p-0 me-3 navbar-toggle-btn" id='navbar-toggle-btn'>
                    <List size={24} />
                </Button>
                <img src="/H2NQ-SVG.svg" alt="H2NQ-AI Logo" className="theme-aware-image" />
            </Col>
            <Col className='d-flex align-items-center justify-content-center'>
                <Dropdown onSelect={handleModelChange}>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="model-dropdown">
                    {getLabelForModel(selectedModel)}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {models.map((model, index) => (
                      model.isDivider ? 
                      <Dropdown.Divider key={index} /> : 
                      <Dropdown.Item key={model.eventKey} eventKey={model.eventKey}>{model.label}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col className="d-flex justify-content-end align-items-center p-3">
                <Dropdown onSelect={changeLanguage} className="language-dropdown">
                  <Dropdown.Toggle variant="link" className="language-toggle-btn">
                    <span className="flag-icon">{currentLanguage.flag}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {languages.map(lang => (
                      <Dropdown.Item key={lang.code} eventKey={lang.code}>
                        <span className="flag-icon">{lang.flag}</span> {lang.nativeName}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Button onClick={toggleTheme} variant="link" className="theme-toggle-btn">
                    {theme === 'light' ? <MoonFill size={20} /> : <SunFill size={20} />}
                </Button>
                <PersonCircle size={30} className="ms-3" onClick={toggleProfileNavbar} style={{ cursor: 'pointer' }} />
            </Col>
        </Row>
    </header>
  );
});

export default Header;
