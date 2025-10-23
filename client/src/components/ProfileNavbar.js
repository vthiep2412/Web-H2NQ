import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
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
  user // Destructure user prop
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
          <Button variant="outline-secondary" className="w-100 profile-button">My Profile</Button>
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
        <h6>{t('theme')}</h6>
        <div className="theme-and-gradient-container">
          {/* This color picker controls the accent color for UI elements like buttons. */}
          <div className="theme-options">
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
      </div>

      <h6>{t('animatedBackground')}</h6>
      <div className="background-options">
        <Button
          className={`btn-background-option ${selectedBackground === 'none' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('none')}
        >
          {t('none')}
        </Button>
        <Button
          className={`btn-background-option ${selectedBackground === 'coloredSnowy' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('coloredSnowy')}
        >
          {t('coloredSnowy')}
        </Button>
        <Button
          className={`btn-background-option ${selectedBackground === 'animatedGradient' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('animatedGradient')}
        >
          {t('animatedGradient')}
        </Button>
        <Button
          className={`btn-background-option ${selectedBackground === 'floatingSquares' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('floatingSquares')}
        >
          {t('floatingSquares')}
        </Button>
        <Button
          className={`btn-background-option ${selectedBackground === 'svgAnimation' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('svgAnimation')}
        >
          {t('svgAnimation')}
        </Button>
        {/* <Button
          className={`btn-background-option ${selectedBackground === 'movingSquares' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('movingSquares')}
        >
          Moving Squares
        </Button> */}
      </div>

      <div className="logout-section">
        <Button variant="danger" onClick={onLogout}>{t('logout')}</Button>
      </div>
    </nav>
  );
});

export default ProfileNavbar;