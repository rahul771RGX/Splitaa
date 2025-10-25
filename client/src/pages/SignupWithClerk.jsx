import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { SignUp } from '@clerk/clerk-react'
import { useTheme } from '../contexts/ThemeContext'
import { registerUser } from '../services/api'

function SignupWithClerk() {
  const { colors } = useTheme()
  const [useClerk, setUseClerk] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCustomSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    
    try {
      await registerUser(formData.name, formData.email, formData.password, formData.phone)
      navigate('/home')
      window.location.reload()
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <div className="signup-page" style={{ backgroundColor: colors.bg.primary }}>
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center py-4">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5}>
            <Card className="shadow-lg border-0 signup-card" style={{
              backgroundColor: colors.bg.card,
              border: `1px solid ${colors.border.primary}`
            }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h1 className="brand-name">Splitaa</h1>
                  <p style={{ color: colors.text.secondary }}>Create your account</p>
                </div>

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
                  <div className="clerk-signup-container">
                    <SignUp 
                      routing="path"
                      path="/signup"
                      signInUrl="/login"
                      afterSignUpUrl="/home"
                      appearance={{
                        elements: {
                          rootBox: 'mx-auto',
                          card: 'shadow-none border-0',
                        }
                      }}
                    />
                  </div>
                ) : (
                  <Form onSubmit={handleCustomSignup}>
                    {error && (
                      <Alert variant="danger" className="mb-3">
                        {error}
                      </Alert>
                    )}
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text.primary }}>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control-custom"
                        style={{
                          backgroundColor: colors.bg.tertiary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text.primary }}>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control-custom"
                        style={{
                          backgroundColor: colors.bg.tertiary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text.primary }}>Phone (Optional)</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control-custom"
                        style={{
                          backgroundColor: colors.bg.tertiary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text.primary }}>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Create a password (min 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="form-control-custom"
                        style={{
                          backgroundColor: colors.bg.tertiary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: colors.text.primary }}>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                    
                    <div className="text-center">
                      <small style={{ color: colors.text.secondary }}>
                        Already have an account? <Link to="/login" className="text-success">Login</Link>
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

export default SignupWithClerk
