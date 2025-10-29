// Happy coding :D
import React from 'react';
import { Card } from 'react-bootstrap';

const FeatureBox = ({ title, description }) => {
  return (
    <Card className="feature-box">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FeatureBox;
