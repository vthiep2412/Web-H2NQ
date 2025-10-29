// Happy coding :D!
// Happy coding :D
import React from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';

const WaitingPage = React.memo(() => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <Container className="text-center">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h1>Waiting for server...</h1>
        <p>The server is currently unavailable. Please wait or try reloading the page.</p>
        <Button onClick={handleReload} variant="primary">Reload</Button>
      </Container>
    </div>
  );
});

export default WaitingPage;
