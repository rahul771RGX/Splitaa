import { Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import DesktopNavbar from '../components/Navbar'
import BalanceCards from '../components/BalanceCards'
import EmptyState from '../components/EmptyState'
import BottomNavigation from '../components/BottomNavigation'
import { useTheme } from '../contexts/ThemeContext'
import { useExpenses } from '../context/ExpensesContext'

const styles = {
  homePage: {
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
  allTimeLink: {
    color: '#22C55E',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    border: 'none',
    backgroundColor: 'transparent'
  }
}

function Home() {
  const isMobile = window.innerWidth < 768
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { user, isLoaded } = useUser()
  const { state } = useExpenses()

  // Check authentication - redirect to login if not authenticated
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token')
      const currentUser = localStorage.getItem('current_user')
      
      // If Clerk is loaded and no user, and no backend auth token, redirect
      if (isLoaded && !user && !token) {
        console.log('⚠️ No authentication found, redirecting to login')
        navigate('/login', { replace: true })
        return
      }
      
      // If we have either Clerk user OR backend token, we're good
      if (user || token) {
        console.log('✅ User authenticated:', user?.primaryEmailAddress?.emailAddress || 'Backend user')
      }
    }
    
    // Only check after Clerk is loaded
    if (isLoaded) {
      checkAuth()
    }
  }, [isLoaded, user, navigate])

  return (
    <div style={{
      ...styles.homePage,
      backgroundColor: colors.bg.primary
    }}>
      <DesktopNavbar />

      <Container style={{
        ...(isMobile ? styles.mainContentMobile : {...styles.mainContent, ...styles.mainContentDesktop})
      }}>
        <BalanceCards />

        <div className="text-center mb-5">
          <Button 
            variant="link" 
            style={styles.allTimeLink}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.brand.light
              e.target.style.color = '#22C55E'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#22C55E'
            }}
          >
            All time <i className="bi bi-chevron-right"></i>
          </Button>
        </div>

        <EmptyState />
      </Container>

      <BottomNavigation />
    </div>
  )
}

export default Home