import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { SignIn } from '@clerk/clerk-react'
import { useTheme } from '../contexts/ThemeContext'
import { loginUser } from '../services/api'

function LoginWithClerk() {
  const { colors } = useTheme()
  const [useClerk, setUseClerk] = useState(false)
  const [email, setEmail] = useState('snk@example.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCustomLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      await loginUser(email, password)
      navigate('/home')
      window.location.reload()
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <div className="login-page" style={{ backgroundColor: colors.bg.primary }}>
      <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={8} md={6} lg={5}>
            <Card className="shadow-lg border-0 login-card" style={{
              backgroundColor: colors.bg.card,
              border: `1px solid ${colors.border.primary}`
            }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h1 className="brand-name">Splitaa</h1>
                  <p style={{ color: colors.text.secondary }}>Split expenses with friends</p>
                </div>

                {/* Toggle between Clerk and Custom Auth */}
                {clerkPubKey && (
                  <div className="text-center mb-4">
                    <Button
                      variant={useClerk ? 'outline-success' : 'success'}
                      size="sm"
                      onClick={() => setUseClerk(!useClerk)}
                      style={{ 
                        borderRadius: '20px',
                        padding: '8px 20px'
                      }}
                    >
                      {useClerk ? 'Use Email/Password' : 'Use Clerk Auth'}
                    </Button>
                  </div>
                )}
                
                {useClerk && clerkPubKey ? (
                  // Clerk Sign In Component
                  <div className="clerk-signin-container">
                    <SignIn 
                      routing="path"
                      path="/login"
                      signUpUrl="/signup"
                      afterSignInUrl="/home"
                      appearance={{
                        elements: {
                          rootBox: 'mx-auto',
                          card: 'shadow-none border-0',
                        }
                      }}
                    />
                  </div>
                ) : (
                  // Custom Login Form
                  <Form onSubmit={handleCustomLogin}>
                    {error && (
                      <Alert variant="danger" className="mb-3">
                        {error}
                      </Alert>
                    )}
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text.primary }}>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control-custom"
                        style={{
                          backgroundColor: colors.bg.tertiary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: colors.text.primary }}>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control-custom"
                        style={{
                          backgroundColor: colors.bg.tertiary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary
                        }}
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      className="w-100 btn-primary-custom mb-3"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                    
                    <div className="text-center">
                      <small style={{ color: colors.text.secondary }}>
                        Don't have an account? <Link to="/signup" className="text-success">Sign up</Link>
                      </small>
                    </div>
                    
                    <div className="text-center mt-3">
                      <small style={{ color: colors.text.muted }}>
                        Test Account: snk@example.com / password
                      </small>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LoginWithClerk
