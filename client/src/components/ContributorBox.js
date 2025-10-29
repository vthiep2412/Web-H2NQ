// Happy coding :D!
// Happy coding :D
import React from 'react';
import { Card } from 'react-bootstrap';

const ContributorBox = ({ name, role }) => {
  return (
    <Card className="contributor-box">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{role}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default ContributorBox;
