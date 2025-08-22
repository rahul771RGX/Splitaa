import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert, ListGroup, Badge } from 'react-bootstrap';
import { useExpenses } from '../context/ExpensesContext';

const Friends = () => {
  const { state, dispatch } = useExpenses();
  const { friends, expenses } = state;
  
  const [showModal, setShowModal] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!newFriend.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (newFriend.email && !/\S+@\S+\.\S+/.test(newFriend.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (friends.some(friend => friend.name.toLowerCase() === newFriend.name.trim().toLowerCase())) {
      newErrors.name = 'Friend with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    dispatch({
      type: 'ADD_FRIEND',
      payload: {
        name: newFriend.name.trim(),
        email: newFriend.email.trim(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newFriend.name.trim())}&background=random`
      }
    });
    
    setNewFriend({ name: '', email: '' });
    setShowModal(false);
    setErrors({});
  };

  const getFriendExpenseCount = (friendId) => {
    return expenses.filter(expense => 
      expense.paidBy === friendId || expense.splitBetween.includes(friendId)
    ).length;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="bi bi-people me-2"></i>
          Friends
        </h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus me-2"></i>
          Add Friend
        </Button>
      </div>

      {friends.length === 0 ? (
        <Alert variant="info" className="text-center">
          <Alert.Heading>No friends added yet!</Alert.Heading>
          <p>Add friends to start splitting expenses together.</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-person-plus me-2"></i>
            Add Your First Friend
          </Button>
        </Alert>
      ) : (
        <Row className="g-4">
          {friends.map((friend) => (
            <Col key={friend.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        backgroundColor: '#007bff',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {getInitials(friend.name)}
                    </div>
                  </div>
                  
                  <Card.Title className="h4">{friend.name}</Card.Title>
                  
                  {friend.email && (
                    <p className="text-muted small">
                      <i className="bi bi-envelope me-1"></i>
                      {friend.email}
                    </p>
                  )}
                  
                  <div className="mt-3">
                    <Badge bg="secondary" className="me-2">
                      <i className="bi bi-receipt me-1"></i>
                      {getFriendExpenseCount(friend.id)} expenses
                    </Badge>
                  </div>
                </Card.Body>
                
                <Card.Footer className="bg-light">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button variant="outline-primary" size="sm">
                      <i className="bi bi-envelope me-1"></i>
                      Message
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-three-dots"></i>
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Friend Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-plus me-2"></i>
            Add New Friend
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter friend's name"
                value={newFriend.name}
                onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email (optional)</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter friend's email"
                value={newFriend.email}
                onChange={(e) => setNewFriend({ ...newFriend, email: e.target.value })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Email is optional but useful for notifications
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <i className="bi bi-plus-circle me-2"></i>
              Add Friend
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Friends;
