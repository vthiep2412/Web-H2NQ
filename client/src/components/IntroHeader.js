import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { SunFill, MoonFill, Wrench, CashCoin, InfoCircle } from 'react-bootstrap-icons';

const IntroHeader = React.memo(({ theme, toggleTheme, onNavClick }) => {
  const isDark = theme === 'dark';

  return (
    <Navbar bg={theme} variant={theme} expand="lg" className="intro-header" fixed="top">
      <Container>
        <Navbar.Brand href="#home" onClick={() => onNavClick('home')}>Web-H2NQ</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#features" onClick={() => onNavClick('features')}><Wrench className='me-2'/>Features</Nav.Link>
            <Nav.Link href="#pricing" onClick={() => onNavClick('pricing')}><CashCoin className='me-2'/>Pricing</Nav.Link>
            <Nav.Link href="#about" onClick={() => onNavClick('about')}><InfoCircle className='me-2'/>About</Nav.Link>
          </Nav>
          <Nav>
            <Button variant={isDark ? 'outline-light' : 'outline-dark'} className="me-2">Sign In</Button>
            <Button variant={isDark ? 'light' : 'dark'}>Sign Up</Button>
            <Button onClick={toggleTheme} variant="link" className="theme-toggle-btn ms-2">
              {isDark ? <SunFill size={20} /> : <MoonFill size={20} />}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default IntroHeader;
