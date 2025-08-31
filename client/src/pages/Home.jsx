import { Container, Button } from 'react-bootstrap'
import DesktopNavbar from '../components/Navbar'
import BalanceCards from '../components/BalanceCards'
import EmptyState from '../components/EmptyState'
import BottomNavigation from '../components/BottomNavigation'
import { useTheme } from '../contexts/ThemeContext'

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
  const { colors } = useTheme()

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