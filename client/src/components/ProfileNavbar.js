import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import './ProfileNavbar.css';

function ProfileNavbar({ theme, onThemeChange, onLogout }) {
  const debounceTimeout = useRef(null);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onThemeChange({ ...theme, primaryColor: newColor });
    }, 0); // 0ms debounce delay, fix lag
  };

  const setBackground = (backgroundType) => {
    onThemeChange({ ...theme, background: backgroundType });
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
        <div className="background-options">
            <Button variant="outline-secondary" onClick={() => setBackground('white')}>White</Button>
            <Button variant="outline-secondary" onClick={() => setBackground('black')}>Black</Button>
            <Button variant="outline-secondary" onClick={() => setBackground('gradient')}>Gradient</Button>
        </div>
      </div>

      <div className="logout-section">
        <Button variant="danger" onClick={onLogout}>Logout</Button>
      </div>
    </nav>
  );
}

export default ProfileNavbar;