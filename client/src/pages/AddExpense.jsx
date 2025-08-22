import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useExpenses } from '../context/ExpensesContext';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
  const { state, dispatch } = useExpenses();
  const { friends } = state;
  const navigate = useNavigate();

  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    paidBy: '',
    splitBetween: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'food', label: '🍽️ Food & Dining', icon: 'bi-cup-straw' },
    { value: 'transport', label: '🚗 Transportation', icon: 'bi-car-front' },
    { value: 'entertainment', label: '🎬 Entertainment', icon: 'bi-film' },
    { value: 'shopping', label: '🛍️ Shopping', icon: 'bi-bag' },
    { value: 'utilities', label: '⚡ Utilities', icon: 'bi-lightning' },
    { value: 'travel', label: '✈️ Travel', icon: 'bi-airplane' },
    { value: 'other', label: '📋 Other', icon: 'bi-three-dots' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!expense.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!expense.amount || parseFloat(expense.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!expense.paidBy) {
      newErrors.paidBy = 'Please select who paid';
    }

    if (expense.splitBetween.length === 0) {
      newErrors.splitBetween = 'Please select at least one person to split with';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      dispatch({
        type: 'ADD_EXPENSE',
        payload: {
          ...expense,
          amount: parseFloat(expense.amount),
          splitBetween: expense.splitBetween.map(id => parseInt(id))
        }
      });

      // Navigate back to expenses page
      navigate('/expenses');
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSplitChange = (friendId, isChecked) => {
    const friendIdNum = parseInt(friendId);
    if (isChecked) {
      setExpense({
        ...expense,
        splitBetween: [...expense.splitBetween, friendIdNum]
      });
    } else {
      setExpense({
        ...expense,
        splitBetween: expense.splitBetween.filter(id => id !== friendIdNum)
      });
    }
  };

  const selectAllFriends = () => {
    setExpense({
      ...expense,
      splitBetween: friends.map(f => f.id)
    });
  };

  const clearAllFriends = () => {
    setExpense({
      ...expense,
      splitBetween: []
    });
  };

  if (friends.length === 0) {
    return (
      <Container>
        <Alert variant="warning" className="text-center">
          <Alert.Heading>No friends added yet!</Alert.Heading>
          <p>You need to add friends before you can create expenses.</p>
          <Button variant="warning" onClick={() => navigate('/friends')}>
            Add Friends First
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="d-flex align-items-center mb-4">
            <Button 
              variant="outline-secondary" 
              className="me-3"
              onClick={() => navigate('/expenses')}
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
            <h1 className="mb-0">
              <i className="bi bi-plus-circle me-2"></i>
              Add New Expense
            </h1>
          </div>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="What was this expense for?"
                        value={expense.description}
                        onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                        isInvalid={!!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount *</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={expense.amount}
                          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                          isInvalid={!!errors.amount}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.amount}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={expense.category}
                        onChange={(e) => setExpense({ ...expense, category: e.target.value })}
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Paid by *</Form.Label>
                      <Form.Select
                        value={expense.paidBy}
                        onChange={(e) => setExpense({ ...expense, paidBy: parseInt(e.target.value) })}
                        isInvalid={!!errors.paidBy}
                      >
                        <option value="">Select who paid</option>
                        {friends.map((friend) => (
                          <option key={friend.id} value={friend.id}>
                            {friend.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.paidBy}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="mb-0">Split between *</Form.Label>
                    <div>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={selectAllFriends}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={clearAllFriends}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  <Card className={`p-3 ${errors.splitBetween ? 'border-danger' : ''}`}>
                    <Row>
                      {friends.map((friend) => (
                        <Col md={6} key={friend.id} className="mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`friend-${friend.id}`}
                            label={friend.name}
                            checked={expense.splitBetween.includes(friend.id)}
                            onChange={(e) => handleSplitChange(friend.id, e.target.checked)}
                          />
                        </Col>
                      ))}
                    </Row>
                    {errors.splitBetween && (
                      <div className="text-danger small mt-2">
                        {errors.splitBetween}
                      </div>
                    )}
                  </Card>
                  
                  {expense.splitBetween.length > 0 && expense.amount && (
                    <Form.Text className="text-muted">
                      Each person owes: ₹{(parseFloat(expense.amount) / expense.splitBetween.length).toFixed(2)}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Notes (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add any additional notes about this expense..."
                    value={expense.notes}
                    onChange={(e) => setExpense({ ...expense, notes: e.target.value })}
                  />
                </Form.Group>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/expenses')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Add Expense
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddExpense;
