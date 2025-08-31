import { Row, Col, Card } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'

const styles = {
  balanceCard: {
    borderRadius: '20px',
    border: 'none',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  balanceCardOwe: {
    background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)'
  },
  balanceCardOwed: {
    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
  },
  balanceAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0',
    color: '#FFFFFF'
  },
  balanceLabel: {
    fontSize: '0.9rem',
    opacity: '0.9',
    margin: '0',
    color: '#FFFFFF'
  },
  balanceIcon: {
    fontSize: '1.5rem',
    opacity: '0.7',
    color: '#FFFFFF'
  }
}

function BalanceCards() {
  const isMobile = window.innerWidth < 768
  const { colors } = useTheme()

  return (
    <Row className={`justify-content-center mb-4 ${isMobile ? 'mx-2' : ''}`}>
      <Col xs={6} sm={6} md={5} lg={4} className={isMobile ? "pe-2" : "mb-3"}>
        <Card 
          style={{
            ...styles.balanceCard, 
            background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
            boxShadow: `0 4px 12px ${colors.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Card.Body className={`d-flex align-items-center justify-content-between ${isMobile ? 'p-3' : 'p-4'}`}>
            <div>
              <h2 style={{...styles.balanceAmount, fontSize: isMobile ? '1.5rem' : '2rem'}}>₹0</h2>
              <p style={{...styles.balanceLabel, fontSize: isMobile ? '0.8rem' : '0.9rem'}}>You owe</p>
            </div>
            {!isMobile && <div>
              <i className="bi bi-trending-up" style={styles.balanceIcon}></i>
            </div>}
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} sm={6} md={5} lg={4} className={isMobile ? "ps-2" : "mb-3"}>
        <Card 
          style={{
            ...styles.balanceCard, 
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            boxShadow: `0 4px 12px ${colors.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Card.Body className={`d-flex align-items-center justify-content-between ${isMobile ? 'p-3' : 'p-4'}`}>
            <div>
              <h2 style={{...styles.balanceAmount, fontSize: isMobile ? '1.5rem' : '2rem'}}>₹0</h2>
              <p style={{...styles.balanceLabel, fontSize: isMobile ? '0.8rem' : '0.9rem'}}>You are owed</p>
            </div>
            {!isMobile && <div>
              <i className="bi bi-trending-down" style={styles.balanceIcon}></i>
            </div>}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default BalanceCards