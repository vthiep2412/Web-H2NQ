import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function IntroductionPage() {
  return (
    <div className="intro-page">
      <Container className="text-center text-white">
        <h1 className="display-3">Welcome to Web-H2NQ</h1>
        <p className="lead">Your intelligent chat companion.</p>
        <Link to="/ai">
          <Button variant="light" size="lg">Get Started</Button>
        </Link>
      </Container>
    </div>
  );
}

export default IntroductionPage;