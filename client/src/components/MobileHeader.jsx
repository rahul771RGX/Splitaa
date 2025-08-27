import { Container, Button } from 'react-bootstrap'

const styles = {
  mobileHeader: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB'
  },
  brandName: {
    color: '#22C55E',
    fontWeight: '700',
    fontSize: '1.5rem',
    margin: '0'
  },
  notificationBtn: {
    border: '1px solid #E5E7EB',
    color: '#6B7280',
    background: '#FFFFFF',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0'
  }
}

function MobileHeader() {
  return (
    <div style={styles.mobileHeader} className="d-md-none">
      <Container>
        <div className="d-flex justify-content-between align-items-center py-3">
          <h1 style={styles.brandName}>Splitaa</h1>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            style={styles.notificationBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F8FAFC'
              e.target.style.borderColor = '#22C55E'
              e.target.style.color = '#22C55E'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FFFFFF'
              e.target.style.borderColor = '#E5E7EB'
              e.target.style.color = '#6B7280'
            }}
          >
            <i className="bi bi-bell"></i>
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default MobileHeader