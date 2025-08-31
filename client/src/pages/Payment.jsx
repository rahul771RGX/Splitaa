import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap'
import { useState } from 'react'
import DesktopNavbar from '../components/Navbar'
import BottomNavigation from '../components/BottomNavigation'
import { useTheme } from '../contexts/ThemeContext'

const styles = {
  paymentPage: {
    minHeight: '100vh'
  },
  mainContent: {
    paddingTop: '2rem',
    paddingBottom: '6rem'
  },
  mainContentDesktop: {
    paddingTop: '3rem',
    paddingBottom: '3rem',
    maxWidth: '800px'
  },
  mainContentMobile: {
    paddingTop: '2.5rem',
    paddingBottom: '6rem',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem'
  },
  paymentCard: {
    borderRadius: '16px',
    border: 'none',
    marginBottom: '1rem'
  },
  quickAmount: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid',
    margin: '0.25rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  quickAmountSelected: {
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
    borderColor: '#22C55E'
  },
  sendButton: {
    backgroundColor: '#22C55E',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '600',
    color: '#FFFFFF',
    width: '100%'
  }
}

function Payment() {
  const isMobile = window.innerWidth < 768
  const { colors } = useTheme()
  const [amount, setAmount] = useState('')
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null)
  const [recipient, setRecipient] = useState('')

  const quickAmounts = [100, 500, 1000, 2000, 5000]

  const handleQuickAmount = (value) => {
    setSelectedQuickAmount(value)
    setAmount(value.toString())
  }

  const handleSendPayment = () => {
    console.log('Sending payment:', { amount, recipient })
  }

  return (
    <div style={{
      ...styles.paymentPage,
      backgroundColor: colors.bg.primary
    }}>
      <DesktopNavbar />

      <Container style={{
        ...styles.mainContent,
        ...(isMobile ? styles.mainContentMobile : styles.mainContentDesktop)
      }}>
        <h2 style={{
          ...styles.pageTitle,
          color: colors.text.primary
        }}>Send Payment</h2>

        <Card style={{
          ...styles.paymentCard,
          backgroundColor: colors.bg.card,
          boxShadow: `0 4px 12px ${colors.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'}`
        }}>
          <Card.Body className="p-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: colors.text.primary }}>Recipient</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter name or phone number"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: colors.text.primary }}>Amount (₹)</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setSelectedQuickAmount(null)
                  }}
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary
                  }}
                />
              </Form.Group>

              <div className="mb-3">
                <Form.Label style={{ color: colors.text.primary }}>Quick Amount</Form.Label>
                <div className="d-flex flex-wrap">
                  {quickAmounts.map(value => (
                    <Button
                      key={value}
                      style={{
                        ...styles.quickAmount,
                        borderColor: colors.border.primary,
                        backgroundColor: colors.bg.secondary,
                        color: colors.text.secondary,
                        ...(selectedQuickAmount === value ? styles.quickAmountSelected : {})
                      }}
                      onClick={() => handleQuickAmount(value)}
                    >
                      ₹{value}
                    </Button>
                  ))}
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: colors.text.primary }}>Description (Optional)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={2}
                  placeholder="What's this payment for?"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary
                  }}
                />
              </Form.Group>

              <Button 
                style={styles.sendButton}
                onClick={handleSendPayment}
                disabled={!amount || !recipient}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#16A34A'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#22C55E'
                  }
                }}
              >
                Send Payment
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Card style={{
          ...styles.paymentCard,
          backgroundColor: colors.bg.card,
          boxShadow: `0 4px 12px ${colors.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'}`
        }}>
          <Card.Body className="p-4">
            <h5 className="mb-3" style={{ color: colors.text.primary }}>Recent Payments</h5>
            <div className="text-center py-4">
              <i className="bi bi-clock-history" style={{ 
                fontSize: '2rem', 
                color: colors.text.secondary, 
                marginBottom: '1rem' 
              }}></i>
              <p style={{ color: colors.text.secondary }}>No recent payments</p>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <BottomNavigation />
    </div>
  )
}

export default Payment
