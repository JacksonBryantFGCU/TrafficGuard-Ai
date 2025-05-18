import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';

function CollapsibleExample({toggleTheme, theme}) {
  

  return (
    <Navbar collapseOnSelect
    expand="lg"
    className={theme === 'dark' ? 'bg-dark navbar-dark' : 'bg-light navbar-light'}>
      <Container fluid>
        <Navbar.Brand href="#home">🏠 FrED IoT Home System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#iot-devices">IoT Devices</Nav.Link>
            <Nav.Link href="#network-status">Network Status</Nav.Link>
            <Nav.Link href="#activity-logs">Activity Logs</Nav.Link>
            <Nav.Link href="#settings">Settings</Nav.Link>
            <Nav.Link href="#alerts">Alerts</Nav.Link>
            <Nav.Link href="#support">Support</Nav.Link>
          </Nav>
          <Nav>
            <Button
              variant={theme === 'dark' ? 'light' : 'dark'}
              onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </Nav>
          <Nav>
            <Nav.Link href="#notifications">Notifications</Nav.Link>
            <NavDropdown title="👤 Account" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  localStorage.removeItem("isFormSubmitted");
                  window.location.reload();
                }}
              >
                Exit ↪
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default CollapsibleExample;
