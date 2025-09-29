import { useState } from 'react' 
import { Link} from 'react-router-dom';
import { Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH
  const [isHcpSelected, setIsHcpSelected] = useState(false);
  const toggleUserType = () => setIsHcpSelected((prev) => !prev);

  return (
    <header className="header sticky">
      <div className="custom-container">
        <Row>
          <div className="header-inner">
            <Navbar
              collapseOnSelect
              expand="lg"
              variant="light"
              className="nav"
            >
              <Navbar.Brand href="/">
                <img src={path_image + "logo-img.svg"}/>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="header-navbar-nav" />
              <Navbar.Collapse
                id="header-navbar-nav"
                className="justify-content-center flex-grow-1"
              >
                <Nav className="x-auto">
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/touchpoints"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Touchpoints
                  </NavLink>
                  <NavLink
                    to="/resources"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Resources
                  </NavLink>
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    My Account
                  </NavLink>
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
                    <span
                      className={`switch-btn ${!isHcpSelected ? "active" : ""}`}
                    >
                      Octapharma
                    </span>
                    <span
                      className={`switch-btn ${isHcpSelected ? "active" : ""}`}
                    >
                      HCP
                    </span>
                  </span>
                  <a className="btn"></a>
                </label>
              </div>
              <div className="logout">
                <div className="user-avatar">
                  <img src={path_image + "avtar-icon.png"} alt="user" />
                </div>
                <span>
                  <Link to="/login">Log Out</Link>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </header>
  );
};

export default Header;
