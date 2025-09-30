import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
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
  selectedBackground,
  onBackgroundChange
}) => {
  const primaryDebounceTimeout = useRef(null);
  const gradient1DebounceTimeout = useRef(null);
  const gradient2DebounceTimeout = useRef(null);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    if (primaryDebounceTimeout.current) {
      clearTimeout(primaryDebounceTimeout.current);
    }
    primaryDebounceTimeout.current = setTimeout(() => {
      onThemeChange({ ...customTheme, primaryColor: newColor });
    }, 0);
  };

  const handleGradientColor1Change = (e) => {
    const newColor = e.target.value;
    if (gradient1DebounceTimeout.current) {
      clearTimeout(gradient1DebounceTimeout.current);
    }
    gradient1DebounceTimeout.current = setTimeout(() => {
      onGradientColor1Change(newColor);
    }, 0);
  };

  const handleGradientColor2Change = (e) => {
    const newColor = e.target.value;
    if (gradient2DebounceTimeout.current) {
      clearTimeout(gradient2DebounceTimeout.current);
    }
    gradient2DebounceTimeout.current = setTimeout(() => {
      onGradientColor2Change(newColor);
    }, 0);
  };

  return (
    <nav className="profile-navbar">
      <div className="profile-section">
        <PersonCircle size={50} />
        <div className="profile-info">
          <h5>User Name</h5>
          <p>user.email@example.com</p>
        </div>
      </div>

      <div className="theme-section">
        <h6>Theme</h6>
        <div className="theme-and-gradient-container">
          <div className="theme-options">
            <Form.Label htmlFor="theme-color-picker">Primary Color</Form.Label>
            <Form.Control
              type="color"
              id="theme-color-picker"
              defaultValue="#007bff"
              title="Choose your color"
              onChange={handleColorChange}
            />
          </div>
          <div className="gradient-section">
            <Form.Label>Gradient Color</Form.Label>
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
                  title="Choose your color"
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
                  title="Choose your color"
                  onChange={handleGradientColor2Change}
                  disabled={!isGradientColor2Enabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h6>Animated Background</h6>
      <div className="background-options">
        <Button
          className={`btn-background-option ${selectedBackground === 'none' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('none')}
        >
          None
        </Button>
        <Button
          className={`btn-background-option ${selectedBackground === 'coloredSnowy' ? 'active' : ''}`}
          onClick={() => onBackgroundChange('coloredSnowy')}
        >
          Colored Snowy
        </Button>
      </div>

      <div className="logout-section">
        <Button variant="danger" onClick={onLogout}>Logout</Button>
      </div>
    </nav>
  );
});

export default ProfileNavbar;