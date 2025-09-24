import React, { useState } from 'react'
import Avatar from '../../../assets/images/avtar-icon.png';
import Logo from '../../../assets/images/logo-img.svg';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Row } from 'react-bootstrap';
const Header = () => {
  const [isHcpSelected, setIsHcpSelected] = useState(false);
  const toggleUserType = () => setIsHcpSelected((prev) => !prev);
  return (
    <header className="header sticky" sticky="top">
      <div className='custom-container'>
        <Row>
          <div className="header-inner">
            {/* <div className="logo">
              <Link to="/"><img src={Logo} alt="logo" /></Link>
            </div> */}
            {/* <Navbar className="nav">
             <Navbar.Toggle aria-controls="responsive-navbar-nav" />
             <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/touchpoints">Patient Journey</Nav.Link>
                    <Nav.Link href="/resources">Resources</Nav.Link>
                    <Nav.Link href="/touchpoints">My Account</Nav.Link>
                  </Nav>
            </Navbar.Collapse>
                </Navbar> */}
            <Navbar collapseOnSelect expand="lg" variant="light" className="nav">
              <Navbar.Brand href="/"><img src={Logo} alt="logo" /></Navbar.Brand>
              <Navbar.Toggle aria-controls="header-navbar-nav" />
              <Navbar.Collapse id="header-navbar-nav" className='justify-content-center flex-grow-1'>
                <Nav className="x-auto">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/touchpoints">Patient Journey</Nav.Link>
                  <Nav.Link href="/resources">Resources</Nav.Link>
                  <Nav.Link href="/touchpoints">My Account</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <div className="header-account d-flex align-items-center">
              <div className="switch">
                <label className="switch-light">
                  <input
                    type="checkbox"
                    checked={isHcpSelected}
                    onChange={toggleUserType}
                    style={{ margin: 0 }}
                  />
                  <span>
                    <span className={`switch-btn ${!isHcpSelected ? "active" : ""}`}>Octapharma</span>
                    <span className={`switch-btn ${isHcpSelected ? "active" : ""}`}>HCP</span>
                  </span>
                  <a className="btn"></a>
                </label>
              </div>
              <div className="logout">
                <div className="user-avatar">
                  <img src={Avatar} alt="user" />
                </div>
                <span><Link to="/">Log Out</Link></span>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </header>
  )
}

export default Header