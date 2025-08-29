import { Container, Card, Button, Row, Col, Form, Modal } from 'react-bootstrap'
import { useState } from 'react'
import DesktopNavbar from '../components/Navbar'
import BottomNavigation from '../components/BottomNavigation'

const styles = {
  accountPage: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC'
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
    color: '#1F2937',
    marginBottom: '1.5rem'
  },
  profileSection: {
    marginBottom: '2rem'
  },
  profileCard: {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  userAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#22C55E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    fontSize: '1.5rem',
    color: '#FFFFFF',
    fontWeight: '600'
  },
  userName: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0'
  },
  userEmail: {
    fontSize: '0.9rem',
    color: '#6B7280',
    margin: '0'
  },
  settingsCard: {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '1rem'
  },
  settingItem: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  settingItemLast: {
    borderBottom: 'none'
  },
  settingIcon: {
    width: '24px',
    textAlign: 'center',
    marginRight: '1rem',
    color: '#6B7280'
  },
  settingText: {
    flex: 1,
    margin: 0,
    color: '#1F2937',
    fontWeight: '500'
  },
  settingArrow: {
    color: '#6B7280'
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '600',
    color: '#FFFFFF',
    width: '100%',
    marginTop: '1rem'
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center'
  }
}

function Account() {
  const isMobile = window.innerWidth < 768
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleSettingClick = (setting) => {
    switch(setting) {
      case 'password':
        setShowPasswordModal(true)
        break
      case 'payments':
        console.log('Navigate to payments history')
        break
      case 'privacy':
        console.log('Navigate to privacy settings')
        break
      case 'help':
        console.log('Navigate to help')
        break
      default:
        break
    }
  }

  const handleLogout = () => {
    console.log('Logout user')
  }

  return (
    <div style={styles.accountPage}>
      <DesktopNavbar />

      <Container style={{
        ...styles.mainContent,
        ...(isMobile ? styles.mainContentMobile : styles.mainContentDesktop)
      }}>
        <h2 style={styles.pageTitle}>Account</h2>

        <div style={styles.profileSection}>
          <Card style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.userAvatar}>
                JD
              </div>
              <div>
                <h3 style={styles.userName}>John Doe</h3>
                <p style={styles.userEmail}>john.doe@example.com</p>
              </div>
            </div>
          </Card>
        </div>

        <Card style={styles.settingsCard}>
          <div 
            style={styles.settingItem}
            onClick={() => handleSettingClick('password')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <i className="bi bi-lock" style={styles.settingIcon}></i>
            <p style={styles.settingText}>Change Password</p>
            <i className="bi bi-chevron-right" style={styles.settingArrow}></i>
          </div>
          
          <div style={styles.settingItem}>
            <i className="bi bi-moon" style={styles.settingIcon}></i>
            <p style={styles.settingText}>Dark Mode</p>
            <div style={styles.switchContainer}>
              <Form.Check 
                type="switch"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            </div>
          </div>
          
          <div style={styles.settingItem}>
            <i className="bi bi-bell" style={styles.settingIcon}></i>
            <p style={styles.settingText}>Notifications</p>
            <div style={styles.switchContainer}>
              <Form.Check 
                type="switch"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </div>
          </div>
          
          <div 
            style={{...styles.settingItem, ...styles.settingItemLast}}
            onClick={() => handleSettingClick('payments')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <i className="bi bi-credit-card" style={styles.settingIcon}></i>
            <p style={styles.settingText}>Payment History</p>
            <i className="bi bi-chevron-right" style={styles.settingArrow}></i>
          </div>
        </Card>

        <Card style={styles.settingsCard}>
          <div 
            style={styles.settingItem}
            onClick={() => handleSettingClick('privacy')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <i className="bi bi-shield-check" style={styles.settingIcon}></i>
            <p style={styles.settingText}>Privacy & Security</p>
            <i className="bi bi-chevron-right" style={styles.settingArrow}></i>
          </div>
          
          <div 
            style={{...styles.settingItem, ...styles.settingItemLast}}
            onClick={() => handleSettingClick('help')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <i className="bi bi-question-circle" style={styles.settingIcon}></i>
            <p style={styles.settingText}>Help & Support</p>
            <i className="bi bi-chevron-right" style={styles.settingArrow}></i>
          </div>
        </Card>

        <Button 
          style={styles.logoutBtn}
          onClick={handleLogout}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </Button>
      </Container>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control type="password" placeholder="Enter current password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm new password" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button 
            style={{backgroundColor: '#22C55E', border: 'none'}}
            onClick={() => {
              setShowPasswordModal(false)
            }}
          >
            Update Password
          </Button>
        </Modal.Footer>
      </Modal>

      <BottomNavigation />
    </div>
  )
}

export default Account