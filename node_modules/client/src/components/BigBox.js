import React from 'react';
import { Card } from 'react-bootstrap';

const BigBox = ({ title, description }) => {
  return (
    <Card className="big-box">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BigBox;
