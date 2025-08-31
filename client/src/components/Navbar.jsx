import { useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { navigationItems, isActivePath } from '../config/navigation'
import { useTheme } from '../contexts/ThemeContext'

const styles = {
  navbar: {
    borderBottom: '1px solid'
  },
  navLink: {
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
    border: '1px solid',
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
  const { colors } = useTheme()

  return (
    <Navbar style={{
      ...styles.navbar,
      backgroundColor: colors.bg.secondary,
      borderBottomColor: colors.border.primary
    }} className="px-4 py-3 shadow-sm d-none d-md-flex">
      <div className="container-fluid d-flex justify-content-between align-items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Navbar.Brand style={styles.brandName}>Splitaa</Navbar.Brand>
        
        <Nav className="align-items-center">
          {navigationItems.map(navItem => (
            <Nav.Link 
              key={navItem.id}
              style={{
                ...styles.navLink, 
                ...(isActivePath(location.pathname, navItem.path) ? styles.navLinkActive : {}),
                color: isActivePath(location.pathname, navItem.path) ? '#22C55E' : colors.text.secondary
              }}
              onClick={() => navigate(navItem.path)}
              onMouseEnter={(e) => {
                if (!isActivePath(location.pathname, navItem.path)) {
                  e.target.style.color = '#22C55E'
                  e.target.style.backgroundColor = colors.brand.light
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivePath(location.pathname, navItem.path)) {
                  e.target.style.color = colors.text.secondary
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
    </Navbar>
  )
}

export default DesktopNavbar