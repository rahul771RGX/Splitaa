import { useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { navigationItems, isActivePath } from '../config/navigation'

const styles = {
  navbar: {
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  navLink: {
    color: '#6B7280',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    margin: '0 4px',
    border: 'none',
    backgroundColor: 'transparent'
  },
  navLinkActive: {
    color: '#22C55E',
    backgroundColor: '#DCFCE7'
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
  },
  brandName: {
    color: '#22C55E',
    fontWeight: '700',
    fontSize: '1.75rem',
    margin: '0'
  }
}

function DesktopNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Navbar style={styles.navbar} className="px-4 py-3 shadow-sm d-none d-md-flex">
      <div className="container-fluid d-flex justify-content-between align-items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Navbar.Brand style={styles.brandName}>Splitaa</Navbar.Brand>
        
        <Nav className="align-items-center">
          {navigationItems.map(navItem => (
            <Nav.Link 
              key={navItem.id}
              style={{
                ...styles.navLink, 
                ...(isActivePath(location.pathname, navItem.path) ? styles.navLinkActive : {})
              }}
              onClick={() => navigate(navItem.path)}
              onMouseEnter={(e) => {
                if (!isActivePath(location.pathname, navItem.path)) {
                  e.target.style.color = '#22C55E'
                  e.target.style.backgroundColor = theme.accent.lightGreen
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivePath(location.pathname, navItem.path)) {
                  e.target.style.color = theme.text.secondary
                  e.target.style.backgroundColor = 'transparent'
                }
              }}
            >
              <i className={`${navItem.icon} me-1`}></i>{navItem.label}
            </Nav.Link>
          ))}
        </Nav>

        <Button 
          variant="outline-secondary" 
          size="sm" 
          style={styles.notificationBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.button.secondaryHover
            e.target.style.borderColor = '#22C55E'
            e.target.style.color = '#22C55E'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.bg.secondary
            e.target.style.borderColor = theme.border.primary
            e.target.style.color = theme.text.secondary
          }}
        >
          <i className="bi bi-bell"></i>
        </Button>
      </div>
    </Navbar>
  )
}

export default DesktopNavbar