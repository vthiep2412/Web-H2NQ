// Happy coding :D
import React, { useState } from 'react';
import { Container, ListGroup, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

function AIMemoryPage({ memories, addMemory, deleteMemory }) {
  const [newMemory, setNewMemory] = useState('');

  const handleAddMemory = () => {
    if (newMemory.trim()) {
      addMemory(newMemory);
      setNewMemory('');
    }
  };

  return (
    <Container fluid className="p-4">
      <h1>AI Memory</h1>
      <p>View and manage the AI's memory.</p>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <Form.Control
              placeholder="Add a new memory..."
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddMemory()}
            />
            <Button onClick={handleAddMemory}>Add Memory</Button>
          </InputGroup>
        </Col>
      </Row>
      <ListGroup>
        {memories.map(mem => (
          <ListGroup.Item key={mem._id} className="d-flex justify-content-between align-items-center">
            {mem.text}
            <Button variant="outline-danger" size="sm" onClick={() => deleteMemory(mem._id)}>
              <Trash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default AIMemoryPage;
