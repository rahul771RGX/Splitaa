import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'
import { Container, Spinner } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function SSOCallback() {
  const { colors } = useTheme()
  const navigate = useNavigate()
  const clerk = useClerk()
  const [status, setStatus] = useState('Processing authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Processing authentication...')
        console.log('🔄 Starting OAuth callback handling...')
        
        if (!clerk.loaded) {
          console.log('⏳ Waiting for Clerk to load...')
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

        await clerk.handleRedirectCallback()
        console.log('OAuth redirect callback handled')

        setStatus('Creating your session...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Get active session
        const session = clerk.session
        if (!session) {
          console.warn('⚠️ No active session found, waiting longer...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }

        // Check if user is signed in
        if (clerk.user) {
          const user = clerk.user
          console.log('User authenticated:', user.primaryEmailAddress?.emailAddress)
          
          // Sync with backend to get proper JWT token
          try {
            setStatus('Syncing with server...')
            const userData = {
              name: user.fullName || `${user.firstName} ${user.lastName}` || 'User',
              email: user.primaryEmailAddress?.emailAddress,
              clerkId: user.id,
              avatar: user.imageUrl
            }
            
            const response = await fetch(`${API_URL}/auth/sync-clerk`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData)
            })
            
            const result = await response.json()
            
            if (result.success && result.data) {
              // Store user data and real JWT token from backend
              localStorage.setItem('current_user', JSON.stringify(result.data.user))
              localStorage.setItem('auth_token', result.data.token)
              localStorage.setItem('clerk_user', JSON.stringify(user))
              
              console.log('User synced with backend')
              console.log('Backend JWT token created')
            } else {
              // Fallback to client-only storage
              localStorage.setItem('current_user', JSON.stringify(userData))
              localStorage.setItem('auth_token', `clerk_${user.id}`)
              localStorage.setItem('clerk_user', JSON.stringify(user))
              console.warn('⚠️ Backend sync failed, using fallback storage')
            }
          } catch (syncError) {
            console.error('Backend sync error:', syncError)
            // Fallback to client-only storage
            const userData = {
              name: user.fullName || `${user.firstName} ${user.lastName}` || 'User',
              email: user.primaryEmailAddress?.emailAddress,
              clerkId: user.id,
              avatar: user.imageUrl
            }
            localStorage.setItem('current_user', JSON.stringify(userData))
            localStorage.setItem('auth_token', `clerk_${user.id}`)
            localStorage.setItem('clerk_user', JSON.stringify(user))
          }
          
          setStatus(`Welcome, ${user.firstName || 'User'}! Redirecting...`)
          
          // Redirect after a short delay
          setTimeout(() => {
            console.log('Redirecting to /home')
            navigate('/home', { replace: true })
          }, 1000)
        } else {
          console.log('No user found after OAuth callback')
          setStatus('Authentication failed. Redirecting to login...')
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 2000)
        }
      } catch (error) {
        console.error('❌ SSO callback error:', error)
        setStatus('Authentication error. Redirecting to login...')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      }
    }

    handleCallback()
  }, [clerk, navigate])

  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: colors.bg.primary }}
    >
      <Container className="text-center">
        <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
        <h4 className="mt-4" style={{ color: colors.text.primary }}>
          {status}
        </h4>
        <p style={{ color: colors.text.secondary }}>
          Please wait, this may take a few seconds...
        </p>
      </Container>
    </div>
  )
}

export default SSOCallback
