// Happy coding :D!
// Happy coding :D
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { PersonCircle, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './ProfileNavbar.css';


const ProfileNavbar = React.memo(({
  currentTheme,
  customTheme = {},
  onThemeChange,
  onLogout,
  gradientColor1,
  gradientColor2,
  onGradientColor1Change,
  onGradientColor2Change,
  isGradientNone,
  isGradientColor1Enabled,
  isGradientColor2Enabled,
  onGradientToggle,
  isGradientAnimated,
  onGradientAnimationToggle,
  selectedBackground,
  onBackgroundChange,
  user,
  darkBackgroundColor,
  onDarkBackgroundColorChange,
  lightBackgroundColor,
  onLightBackgroundColorChange,
  gradientBackgroundColor1,
  onGradientBackgroundColor1Change,
  gradientBackgroundColor2,
  onGradientBackgroundColor2Change,
  isGradientBackgroundColor1Enabled,
  onGradientBackgroundColor1Toggle,
  isGradientBackgroundColor2Enabled,
  onGradientBackgroundColor2Toggle,
  gradientDirection,
  setGradientDirection,
  isGradientBackgroundAnimated,
  onGradientBackgroundAnimationToggle,
  onRevertAccentGradient,
  onRevertBackgroundGradient
}) => {
  const { t } = useTranslation();

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    onThemeChange({ ...customTheme, primaryColor: newColor });
  };

  const handleGradientColor1Change = (e) => {
    const newColor = e.target.value;
    onGradientColor1Change(newColor);
  };

  const handleGradientColor2Change = (e) => {
    const newColor = e.target.value;
    onGradientColor2Change(newColor);
  };

  const handleDarkBackgroundColorChange = (e) => {
    onDarkBackgroundColorChange(e.target.value);
  };

  const handleLightBackgroundColorChange = (e) => {
    onLightBackgroundColorChange(e.target.value);
  };
  const handleGradientBackgroundColor1Change = (e) => {
    onGradientBackgroundColor1Change(e.target.value);
  };

  const handleGradientBackgroundColor2Change = (e) => {
    onGradientBackgroundColor2Change(e.target.value);
  };
 
  return (
    <nav className="profile-navbar">
      <div className="profile-section">
        {user && user.avatarUrl ? (
          <img src={user.avatarUrl} alt="User Avatar" className="profile-avatar" />
        ) : (
          <PersonCircle size={50} />
        )}
        <div className="profile-info">
          <h5>{user ? user.name : t('guest')}</h5>
          <p>{user ? user.email : t('guestEmail')}</p>
          <p>{t('tier')}: {user ? user.tier : t('guestTier')}</p>
        </div>
      </div>

      <div className="profile-actions-section">
        <Link to="/profile" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
          <Button variant="outline-secondary" className="w-100 profile-button">{t('myProfile')}</Button>
        </Link>
      </div>

      <div className="token-usage-section">
        <h6>{t('tokenUsage')}</h6>
        <div className="token-bar-container">
          <div className="token-bar" style={{ width: `${user ? (user.tokenLeft / 1000) * 100 : 0}%` }}></div>
        </div>
        <p>{t('tokensLeft')}: {user ? user.tokenLeft : 0} / 1000</p>
      </div>

      <div className="theme-section">
        <hr></hr>
        <h6 className='themeSectionTitle'>{t('theme')}</h6>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className='ACandGraColor mb-0'>{t('AcentColor&GradientColor')}</h6>
          <Button variant="link" onClick={onRevertAccentGradient} title="Revert to default" className={currentTheme === 'dark' ? 'text-white' : 'text-dark'}>
            <ArrowCounterclockwise size={20} />
          </Button>
        </div>
        <div className="theme-and-gradient-container">
          {/* This color picker controls the accent color for UI elements like buttons. */}
          <div className="theme-options fix-primarycolor">
            <Form.Label htmlFor="theme-color-picker">{t('primaryColor')}</Form.Label>
            <Form.Control
              type="color"
              id="theme-color-picker"
              defaultValue="#007bff"
              title={t('chooseYourColor')}
              onChange={handleColorChange}
            />
          </div>
          <div className="gradient-section">
            <Form.Label>{t('gradientColor')}</Form.Label>
            <div className="color-pickers-container">
              <div className="color-picker-item">
                <Form.Check 
                  type="switch"
                  id="gradient-color1-switch"
                  checked={isGradientColor1Enabled}
                  onChange={() => onGradientToggle('color1')}
                />
                <Form.Control
                  type="color"
                  id="gradient-color1-picker"
                  value={gradientColor1}
                  title={t('chooseYourColor')}
                  onChange={handleGradientColor1Change}
                  disabled={!isGradientColor1Enabled}
                />
              </div>
              <div className="color-picker-item">
                <Form.Check 
                  type="switch"
                  id="gradient-color2-switch"
                  checked={isGradientColor2Enabled}
                  onChange={() => onGradientToggle('color2')}
                />
                <Form.Control
                  type="color"
                  id="gradient-color2-picker"
                  value={gradientColor2}
                  title={t('chooseYourColor')}
                  onChange={handleGradientColor2Change}
                  disabled={!isGradientColor2Enabled}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="gradient-animation-section">
            <Form.Check
                type="switch"
                id="gradient-animation-switch"
                label={t('gradientAnimation')}
                checked={isGradientAnimated}
                onChange={onGradientAnimationToggle}
            />
        </div>
        <hr></hr>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className='BGandGraColor mb-0'>{t('background&GradientColor')}</h6>
          <Button variant="link" onClick={onRevertBackgroundGradient} title="Revert to default" className={currentTheme === 'dark' ? 'text-white' : 'text-dark'}>
            <ArrowCounterclockwise size={20} />
          </Button>
        </div>
        <div className="background-color-pickers-container">
          <div className="theme-options">
            <Form.Label htmlFor="dark-background-color-picker">{t('darkTheme')}</Form.Label>
            <Form.Control
              type="color"
              id="dark-background-color-picker"
              value={darkBackgroundColor}
              onChange={handleDarkBackgroundColorChange}
            />
          </div>
          <div className="theme-options">
            <Form.Label htmlFor="light-background-color-picker">{t('lightTheme')}</Form.Label>
            <Form.Control
              type="color"
              id="light-background-color-picker"
              value={lightBackgroundColor}
              onChange={handleLightBackgroundColorChange}
            />
          </div>
        </div>
        <div className="gradient-section">
          <Form.Label>{t('gradientBackgroundColor')}</Form.Label>
          <div className="color-pickers-container background-color-pickers-container">
            <div className="color-picker-item">
              <Form.Check
                type="switch"
                id="gradient-background-color1-switch"
                checked={isGradientBackgroundColor1Enabled}
                onChange={onGradientBackgroundColor1Toggle}
              />
              <Form.Control
                type="color"
                id="gradient-background-color1-picker"
                value={gradientBackgroundColor1}
                title={t('chooseYourColor')}
                onChange={handleGradientBackgroundColor1Change}
                disabled={!isGradientBackgroundColor1Enabled}
              />
            </div>
            <div className="color-picker-item">
              <Form.Check
                type="switch"
                id="gradient-background-color2-switch"
                checked={isGradientBackgroundColor2Enabled}
                onChange={onGradientBackgroundColor2Toggle}
              />
              <Form.Control
                type="color"
                id="gradient-background-color2-picker"
                value={gradientBackgroundColor2}
                title={t('chooseYourColor')}
                onChange={handleGradientBackgroundColor2Change}
                disabled={!isGradientBackgroundColor2Enabled}
              />
            </div>
          </div>
        </div>
        <div className="gradient-direction-section">
          <Form.Label>{t('gradientDirection')}</Form.Label>
          <Form.Select value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)}>
            <option value="to bottom">{t('toBottom')}</option>
            <option value="to top">{t('toTop')}</option>
            <option value="to left">{t('toLeft')}</option>
            <option value="to right">{t('toRight')}</option>
          </Form.Select>
        </div>
      </div>
      <hr></hr>
      <h6 className='AniBG'>{t('animatedBackground')}</h6>
      <Form.Select value={selectedBackground} onChange={(e) => onBackgroundChange(e.target.value)}>
        <option value="none">{t('none')}</option>
        <option value="gradientAnimation">{t('gradientAnimation')}</option>
        <option value="coloredSnowy">{t('coloredSnowy')}</option>
        <option value="floatingSquares">{t('floatingSquares')}</option>
        <option value="waveAnimation">{t('waveAnimation')}</option>
      </Form.Select>

      <div className="logout-section">
        <Button variant="danger" onClick={onLogout}>{t('logout')}</Button>
      </div>
    </nav>
  );
});

export default ProfileNavbar;