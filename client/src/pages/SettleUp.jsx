import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Form } from 'react-bootstrap';
import { useExpenses } from '../context/ExpensesContext';
import { calculateBalances, calculateSettlements, formatCurrency } from '../services/calculations';

const SettleUp = () => {
  const { state, dispatch } = useExpenses();
  const { expenses, friends } = state;
  
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [settlementMethod, setSettlementMethod] = useState('cash');

  const balances = calculateBalances(expenses, friends);
  const settlements = calculateSettlements(balances);

  const handleSettleUp = (settlement) => {
    setSelectedSettlement(settlement);
    setShowSettleModal(true);
  };

  const confirmSettlement = () => {
    if (selectedSettlement) {
      dispatch({
        type: 'ADD_SETTLEMENT',
        payload: {
          ...selectedSettlement,
          method: settlementMethod,
          status: 'completed'
        }
      });

      // Create a balancing expense to reflect the settlement
      dispatch({
        type: 'ADD_EXPENSE',
        payload: {
          description: `Settlement: ${selectedSettlement.from} → ${selectedSettlement.to}`,
          amount: selectedSettlement.amount,
          category: 'other',
          paidBy: selectedSettlement.toId,
          splitBetween: [selectedSettlement.fromId],
          notes: `Settlement via ${settlementMethod}`,
          isSettlement: true
        }
      });

      setShowSettleModal(false);
      setSelectedSettlement(null);
      setSettlementMethod('cash');
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 0.01) return 'success';
    if (balance < -0.01) return 'danger';
    return 'secondary';
  };

  const getBalanceIcon = (balance) => {
    if (balance > 0.01) return 'bi-arrow-up-circle';
    if (balance < -0.01) return 'bi-arrow-down-circle';
    return 'bi-dash-circle';
  };

  const getBalanceText = (balance) => {
    if (balance > 0.01) return 'gets back';
    if (balance < -0.01) return 'owes';
    return 'settled';
  };

  return (
    <Container>
      <h1 className="mb-4">
        <i className="bi bi-credit-card me-2"></i>
        Settle Up
      </h1>

      {friends.length === 0 && (
        <Alert variant="warning">
          <Alert.Heading>No friends added yet!</Alert.Heading>
          <p>Add friends and record some expenses to see settlement suggestions.</p>
        </Alert>
      )}

      {expenses.length === 0 && friends.length > 0 && (
        <Alert variant="info">
          <Alert.Heading>No expenses recorded yet!</Alert.Heading>
          <p>Record some expenses to see who owes what.</p>
        </Alert>
      )}

      {settlements.length === 0 && expenses.length > 0 && (
        <Alert variant="success" className="text-center">
          <Alert.Heading>🎉 Everyone is settled up!</Alert.Heading>
          <p>All balances are even. No settlements needed.</p>
        </Alert>
      )}

      <Row className="g-4">
        {/* Current Balances */}
        {friends.length > 0 && (
          <Col lg={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-scale me-2"></i>
                  Current Balances
                </h5>
              </Card.Header>
              <Card.Body>
                {Object.entries(balances).map(([friendId, data]) => (
                  <div key={friendId} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div 
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center me-3 text-${getBalanceColor(data.balance)}`}
                        style={{ width: '40px', height: '40px', backgroundColor: `var(--bs-${getBalanceColor(data.balance)})`, color: 'white' }}
                      >
                        <i className={getBalanceIcon(data.balance)}></i>
                      </div>
                      <div>
                        <strong>{data.name}</strong>
                        <br />
                        <small className={`text-${getBalanceColor(data.balance)}`}>
                          {getBalanceText(data.balance)}
                        </small>
                      </div>
                    </div>
                    <div className={`text-${getBalanceColor(data.balance)} fw-bold h5 mb-0`}>
                      {formatCurrency(Math.abs(data.balance))}
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Suggested Settlements */}
        {settlements.length > 0 && (
          <Col lg={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Suggested Settlements ({settlements.length})
                </h5>
              </Card.Header>
              <Card.Body>
                {settlements.map((settlement, index) => (
                  <Card key={index} className="mb-3 border-start border-primary border-3">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={8}>
                          <div className="d-flex align-items-center mb-2">
                            <div className="me-3">
                              <div className="fw-bold">{settlement.from}</div>
                              <div className="text-muted">
                                <i className="bi bi-arrow-right me-1"></i>
                                pays
                              </div>
                              <div className="fw-bold">{settlement.to}</div>
                            </div>
                          </div>
                          <div className="h5 text-primary mb-0">
                            {formatCurrency(settlement.amount)}
                          </div>
                        </Col>
                        <Col md={4} className="text-end">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleSettleUp(settlement)}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Settle
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Settle Up Modal */}
      <Modal show={showSettleModal} onHide={() => setShowSettleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-check-circle me-2"></i>
            Confirm Settlement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSettlement && (
            <>
              <div className="text-center mb-4">
                <div className="p-4 bg-light rounded">
                  <h4 className="mb-2">{selectedSettlement.from}</h4>
                  <div className="text-muted mb-2">pays</div>
                  <h4 className="mb-3">{selectedSettlement.to}</h4>
                  <div className="h3 text-success">
                    {formatCurrency(selectedSettlement.amount)}
                  </div>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  value={settlementMethod}
                  onChange={(e) => setSettlementMethod(e.target.value)}
                >
                  <option value="cash">💵 Cash</option>
                  <option value="venmo">📱 Venmo</option>
                  <option value="paypal">💳 PayPal</option>
                  <option value="zelle">🏦 Zelle</option>
                  <option value="bank-transfer">🏦 Bank Transfer</option>
                  <option value="other">📋 Other</option>
                </Form.Select>
              </Form.Group>

              <Alert variant="info" className="mb-0">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  This will record the settlement and update balances accordingly.
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettleModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmSettlement}>
            <i className="bi bi-check-circle me-2"></i>
            Record Settlement
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SettleUp;
