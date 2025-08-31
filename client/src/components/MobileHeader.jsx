import { Container, Button } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'

const styles = {
  mobileHeader: {
    borderBottom: '1px solid'
  },
  brandName: {
    color: '#22C55E',
    fontWeight: '700',
    fontSize: '1.5rem',
    margin: '0'
  },
  notificationBtn: {
    border: '1px solid',
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
  const { colors } = useTheme()

  return (
    <div style={{
      ...styles.mobileHeader,
      backgroundColor: colors.bg.secondary,
      borderBottomColor: colors.border.primary
    }} className="d-md-none">
      <Container>
        <div className="d-flex justify-content-between align-items-center py-3">
          <h1 style={styles.brandName}>Splitaa</h1>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            style={{
              ...styles.notificationBtn,
              borderColor: colors.border.primary,
              color: colors.text.secondary,
              backgroundColor: colors.bg.secondary
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.bg.tertiary
              e.target.style.borderColor = '#22C55E'
              e.target.style.color = '#22C55E'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.bg.secondary
              e.target.style.borderColor = colors.border.primary
              e.target.style.color = colors.text.secondary
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