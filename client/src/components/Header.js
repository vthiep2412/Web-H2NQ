import React from 'react';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
import { PersonCircle, List, SunFill, MoonFill } from 'react-bootstrap-icons';
import { models, getLabelForModel } from '../utils/models';

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
