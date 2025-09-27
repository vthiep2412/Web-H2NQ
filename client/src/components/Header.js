import React from 'react';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
import { PersonCircle, List, SunFill, MoonFill } from 'react-bootstrap-icons';

function Header({ 
  theme, 
  toggleTheme, 
  toggleNavbar, 
  selectedModel, 
  handleModelChange 
}) {
  return (
    <header className="app-header">
        <Row className='d-flex align-items-center'>
            <Col className="d-flex align-items-center">
                <Button variant="link" onClick={toggleNavbar} className="p-0 me-3 navbar-toggle-btn" id='navbar-toggle-btn'>
                    <List size={24} />
                </Button>
                <h3 className="ai-name">Web-H2NQ</h3>
            </Col>
            <Col className='d-flex align-items-center justify-content-center'>
                <Dropdown onSelect={handleModelChange}>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="model-dropdown">
                    {selectedModel}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="gemini-2.5-pro">Gemini 2.5 Pro</Dropdown.Item>
                    <Dropdown.Item eventKey="gemini-2.5-flash">Gemini 2.5 Flash</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="gpt-4">GPT-5</Dropdown.Item>
                    <Dropdown.Item eventKey="gpt-3.5-turbo">GPT-4.1</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col className="d-flex justify-content-end align-items-center p-3">
                <Button onClick={toggleTheme} variant="link" className="theme-toggle-btn">
                    {theme === 'light' ? <MoonFill size={20} /> : <SunFill size={20} />}
                </Button>
                <PersonCircle size={30} className="ms-3" />
            </Col>
        </Row>
    </header>
  );
}

export default Header;
