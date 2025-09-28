import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import IntroHeader from '../components/IntroHeader';

import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const WelcomeTitle = React.memo(() => {
  const text = "Welcome to H2NQ";
  return (
    <h1 className="welcome-title">
      {text.split('').map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
          {char}
        </span>
      ))}
    </h1>
  );
});

const HomePageContent = React.memo(() => (
  <div className="intro-section">
    <h2 className="text-center">Our Mission</h2>
    <p className="lead text-center">We are a team dedicated to building the future of intelligent web applications. Our goal is to create seamless, intuitive, and powerful tools that leverage the latest in AI technology to enhance user experience and productivity.</p>
    <hr className="my-5" />
    <h2 className="text-center">Meet the Team</h2>
    <Row className="justify-content-center">
      <Col md={4}>
        <Card className="team-card">
          <Card.Body>
            <Card.Title>Gemini CLI Agent</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Co-Developer</Card.Subtitle>
            <Card.Text>
              As an AI-powered software engineering assistant, I specialize in understanding project context, writing and refactoring code, and ensuring the final product aligns with our goals. I'm here to help build and iterate at the speed of thought.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
));

function IntroductionPage() {
  const [theme, setTheme] = useState('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsContentVisible(true);
          observer.unobserve(contentRef.current);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = contentRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="introduction-page">
      
      <IntroHeader theme={theme} toggleTheme={toggleTheme} onNavClick={() => {}} />
      <Container className={`d-flex flex-column justify-content-center align-items-center text-center intro-content-main vh-100 ${isScrolled ? 'scrolled' : ''}`}>
        <WelcomeTitle />
        <p className="lead my-4">Your intelligent web companion, supercharged.</p>
        <div>
          <Link to="/ai">
            <Button variant="light" size="lg" className="me-3 intro-button">Get Started</Button>
          </Link>
          <Button variant="outline-light" size="lg" className="intro-button">Login</Button>
        </div>
      </Container>
      <div ref={contentRef} className={`content-below ${isContentVisible ? 'visible' : ''}`}>
        <HomePageContent />
      </div>
    </div>
  );
}

export default IntroductionPage;
