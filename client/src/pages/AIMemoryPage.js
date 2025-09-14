import React, { useState } from 'react';
import { Container, ListGroup, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

function AIMemoryPage() {
  const [memories, setMemories] = useState([
    { id: 1, text: 'The user prefers concise answers.' },
    { id: 2, text: 'The user is a software developer.' },
    { id: 3, text: 'The user is working on a project called Web-H2NQ.' },
  ]);
  const [newMemory, setNewMemory] = useState('');

  const addMemory = () => {
    if (newMemory.trim()) {
      setMemories([...memories, { id: Date.now(), text: newMemory }]);
      setNewMemory('');
    }
  };

  const deleteMemory = (id) => {
    setMemories(memories.filter(mem => mem.id !== id));
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
              onKeyPress={e => e.key === 'Enter' && addMemory()}
            />
            <Button onClick={addMemory}>Add Memory</Button>
          </InputGroup>
        </Col>
      </Row>
      <ListGroup>
        {memories.map(mem => (
          <ListGroup.Item key={mem.id} className="d-flex justify-content-between align-items-center">
            {mem.text}
            <Button variant="outline-danger" size="sm" onClick={() => deleteMemory(mem.id)}>
              <Trash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default AIMemoryPage;
