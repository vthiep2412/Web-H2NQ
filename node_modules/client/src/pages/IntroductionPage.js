import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import IntroHeader from '../components/IntroHeader';
import FeatureBox from '../components/FeatureBox';
import BigBox from '../components/BigBox';
import ContributorBox from '../components/ContributorBox';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './IntroductionPage.css';

// --- Data --- //
const features = [
  { title: 'AI-Powered Chat', description: 'Engage with a context-aware AI that understands your project.' },
  { title: 'Code Generation', description: 'Generate code snippets, refactor, and debug with AI assistance.' },
  { title: 'Workspace Management', description: 'Organize your projects and conversations in dedicated workspaces.' },
  { title: 'Customizable Themes', description: 'Personalize your workspace with custom primary and gradient colors.' },
  { title: 'Seamless Git Integration', description: 'Review changes, write commit messages, and run tests with AI help.' },
];

const bigBoxContent = [
    { title: 'Advanced AI Integration', description: 'H2NQ-AI seamlessly integrates multiple leading AI models, allowing you to switch between them on the fly. From coding and debugging to content creation, get the best results by choosing the right tool for the job.'},
    { title: 'Full Project Context', description: 'Unlike other tools, the AI has full access to your project\'s context. This enables it to provide more accurate, relevant, and helpful responses, understanding the nuances of your codebase.'},
    { title: 'Developer-First Workflow', description: 'Built as an interactive CLI agent, H2NQ-AI is designed to fit into your natural development workflow. It\'s a powerful partner that helps you build, test, and iterate faster than ever before.'},
];

const contributors = [
    { name: 'vthiep2412', role: 'Lead Developer' },
    { name: 'Gemini', role: 'AI Co-Developer' },
    { name: 'React', role: 'UI Framework' },
    { name: 'Node.js', role: 'Backend Environment' },
    { name: 'Bootstrap', role: 'Styling Foundation' },
];

const FeaturesSection = () => (
    <div className="features-section">
        <h2 className="text-center">Features</h2>
        <Row>
            {features.map((feature, index) => (
                <Col key={index} className="mb-4">
                    <FeatureBox title={feature.title} description={feature.description} />
                </Col>
            ))}
        </Row>
    </div>
);

const BigBoxesSection = () => (
    <div className="big-boxes-section">
        <h2 className="text-center">Why H2NQ-AI?</h2>
        <Row className="justify-content-center">
            {bigBoxContent.map((box, index) => (
                <Col md={4} key={index} className="mb-4">
                    <BigBox title={box.title} description={box.description} />
                </Col>
            ))}
        </Row>
    </div>
);

const ContributorsSection = () => (
    <div className="contributors-section">
        <h2 className="text-center">Contributors & Technologies</h2>
        <Row>
            {contributors.map((contributor, index) => (
                <Col key={index} className="mb-4">
                    <ContributorBox name={contributor.name} role={contributor.role} />
                </Col>
            ))}
        </Row>
    </div>
);


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

// --- Main Page Component --- //
function IntroductionPage() {
  const [theme, setTheme] = useState('dark');
  const { token } = useAuth(); // Get token from AuthContext
  const navigate = useNavigate(); // Get navigate function

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  // Redirect if authenticated
  useEffect(() => {
    if (token) {
      navigate('/ai');
    }
  }, [token, navigate]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="introduction-page">
      <IntroHeader theme={theme} toggleTheme={toggleTheme} onNavClick={() => {}} />
      <Container className={`d-flex flex-column justify-content-center align-items-start text-start intro-content-main vh-100 position-relative`}>
        <WelcomeTitle />
        <p className="lead my-4">Your intelligent web companion, supercharged.</p>
        <div>
          <Link to="/auth">
            <Button variant="light" size="lg" className="me-3 intro-button">Get Started</Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline-light" size="lg" className="intro-button">Login</Button>
          </Link>
        </div>
      </Container>
      <div className="content-below">
        <FeaturesSection />
        <hr className="my-5" />
        <BigBoxesSection />
        <hr className="my-5" />
        <ContributorsSection />
      </div>
    </div>
  );
}

export default IntroductionPage;
