import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Alert } from 'react-bootstrap';
import { useExpenses } from '../context/ExpensesContext';
import { formatCurrency, formatDate } from '../services/calculations';
import { Link } from 'react-router-dom';

const Expenses = () => {
  const { state, dispatch } = useExpenses();
  const { expenses, friends } = state;
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDeleteExpense = () => {
    if (expenseToDelete) {
      dispatch({
        type: 'DELETE_EXPENSE',
        payload: expenseToDelete.id
      });
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    }
  };

  const openDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const getFriendName = (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    return friend ? friend.name : 'Unknown';
  };

  const getSplitNames = (splitBetween) => {
    return splitBetween.map(id => getFriendName(id)).join(', ');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'food': 'bi-cup-straw',
      'transport': 'bi-car-front',
      'entertainment': 'bi-film',
      'shopping': 'bi-bag',
      'utilities': 'bi-lightning',
      'travel': 'bi-airplane',
      'other': 'bi-three-dots'
    };
    return icons[category] || 'bi-receipt';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'food': 'primary',
      'transport': 'success',
      'entertainment': 'warning',
      'shopping': 'info',
      'utilities': 'danger',
      'travel': 'secondary',
      'other': 'dark'
    };
    return colors[category] || 'secondary';
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="bi bi-receipt me-2"></i>
          Expenses
        </h1>
        <Link to="/expenses/add">
          <Button variant="primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add Expense
          </Button>
        </Link>
      </div>

      {friends.length === 0 && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>No friends added yet!</Alert.Heading>
          <p>You need to add friends before you can create expenses.</p>
          <Link to="/friends">
            <Button variant="outline-warning">Add Friends First</Button>
          </Link>
        </Alert>
      )}

      {expenses.length === 0 ? (
        <Alert variant="info" className="text-center">
          <Alert.Heading>No expenses recorded yet!</Alert.Heading>
          <p>Start tracking your shared expenses by adding your first expense.</p>
          {friends.length > 0 && (
            <Link to="/expenses/add">
              <Button variant="primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add Your First Expense
              </Button>
            </Link>
          )}
        </Alert>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">All Expenses ({expenses.length})</h5>
                  <div className="text-muted">
                    Total: {formatCurrency(expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0))}
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Paid by</th>
                        <th>Split between</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td>
                            <small className="text-muted">
                              {formatDate(expense.date)}
                            </small>
                          </td>
                          <td>
                            <strong>{expense.description}</strong>
                            {expense.notes && (
                              <div>
                                <small className="text-muted">{expense.notes}</small>
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge bg={getCategoryColor(expense.category)} className="text-capitalize">
                              <i className={`${getCategoryIcon(expense.category)} me-1`}></i>
                              {expense.category}
                            </Badge>
                          </td>
                          <td>
                            <strong className="text-success">
                              {formatCurrency(expense.amount)}
                            </strong>
                          </td>
                          <td>{getFriendName(expense.paidBy)}</td>
                          <td>
                            <small className="text-muted">
                              {getSplitNames(expense.splitBetween)}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                title="Delete"
                                onClick={() => openDeleteModal(expense)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
            Delete Expense
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {expenseToDelete && (
            <>
              <p>Are you sure you want to delete this expense?</p>
              <div className="p-3 bg-light rounded">
                <strong>{expenseToDelete.description}</strong><br />
                <small className="text-muted">
                  {formatCurrency(expenseToDelete.amount)} • {formatDate(expenseToDelete.date)}
                </small>
              </div>
              <Alert variant="warning" className="mt-3 mb-0">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  This action cannot be undone and will affect balance calculations.
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteExpense}>
            <i className="bi bi-trash me-2"></i>
            Delete Expense
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Expenses;
