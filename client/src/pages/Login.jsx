import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'

function Login() {
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      navigate('/home')
    }
  }

  return (
    <div className="login-page" style={{ backgroundColor: colors.bg.primary }}>
      <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="shadow-lg border-0 login-card" style={{
              backgroundColor: colors.bg.card,
              border: `1px solid ${colors.border.primary}`
            }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h1 className="brand-name">Splitaa</h1>
                  <p style={{ color: colors.text.secondary }}>Split expenses with friends</p>
                </div>
                
                <Form onSubmit={handleSubmit}>
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
                  >
                    Login
                  </Button>
                  
                  <div className="text-center">
                    <small style={{ color: colors.text.secondary }}>
                      Don't have an account? <a href="#" className="text-success">Sign up</a>
                    </small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login