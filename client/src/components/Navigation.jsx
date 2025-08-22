import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import { Home, Users, Settings, Bell, Plus, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <Navbar expand="lg" className="navbar d-none d-md-flex">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              Splitaa
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link className={location.pathname === '/' ? 'active' : ''}>
                  <Home size={20} />
                  Home
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/friends">
                <Nav.Link className={location.pathname === '/friends' ? 'active' : ''}>
                  <Users size={20} />
                  Groups
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/settle">
                <Nav.Link className={location.pathname === '/settle' ? 'active' : ''}>
                  <Settings size={20} />
                  Settle Up
                </Nav.Link>
              </LinkContainer>
            </Nav>
            
            <div className="d-flex align-items-center gap-3">
              <Button variant="outline-secondary" size="sm" className="d-none d-md-inline-flex">
                <Bell size={20} />
              </Button>
              
              <LinkContainer to="/events/add">
                <Button className="btn-create-event">
                  <Plus size={16} />
                  Create Event
                </Button>
              </LinkContainer>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Top Bar */}
      <div className="mobile-top-bar d-md-none">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="brand-mobile">Splitaa</div>
            <Button variant="outline-secondary" size="sm">
              <Bell size={20} />
            </Button>
          </div>
        </Container>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav d-md-none">
        <LinkContainer to="/">
          <div className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={24} />
            <span>Home</span>
          </div>
        </LinkContainer>
        
        <LinkContainer to="/friends">
          <div className={`mobile-nav-item ${location.pathname === '/friends' ? 'active' : ''}`}>
            <Users size={24} />
            <span>Groups</span>
          </div>
        </LinkContainer>
        
        <LinkContainer to="/events/add">
          <div className="mobile-nav-item mobile-nav-add">
            <Plus size={28} />
          </div>
        </LinkContainer>
        
        <LinkContainer to="/settle">
          <div className={`mobile-nav-item ${location.pathname === '/settle' ? 'active' : ''}`}>
            <Settings size={24} />
            <span>Settle Up</span>
          </div>
        </LinkContainer>
        
        <LinkContainer to="/profile">
          <div className={`mobile-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <User size={24} />
            <span>Profile</span>
          </div>
        </LinkContainer>
      </div>
    </>
  );
};

export default Navigation;
