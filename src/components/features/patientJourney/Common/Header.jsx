import { useContext } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../../../../helper/helper";
import { ContentContext } from "../../../../context/ContentContext";
const Header = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { isHcp, setIsHcp } = useContext(ContentContext);
  // const toggleUserType = () => setIsHcpSelected((prev) => !prev);
  const toggleUserType = () => {
    setIsHcp((prev) => {
      const newValue = !prev;

      // If switching to HCP and not already on touchpoints/resources → redirect to /touchpoints
      if (
        newValue &&
        location.pathname !== "/touchpoints" &&
        location.pathname !== "/resources"
      ) {
        navigate("/touchpoints");
      }

      return newValue;
    });
  };
  const navigate = useNavigate();

  const logout = () => {
    clearLocalStorage();
    navigate("/");
  };

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
                <img src={path_image + "vwd-journey-logo.svg"} alt="logo" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="header-navbar-nav" />
              <Navbar.Collapse
                id="header-navbar-nav"
                className="justify-content-center flex-grow-1"
              >
                <Nav className="x-auto">
                  {!isHcp && (
                    <NavLink
                      to="/home"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      Home
                    </NavLink>
                  )}
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

                  {!isHcp && (
                    <NavLink
                      to="/account"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      My Account
                    </NavLink>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <div className="header-account d-flex align-items-center">
              <div className="switch">
                <label className="switch-light">
                  <input
                    type="checkbox"
                    checked={isHcp}
                    onChange={toggleUserType}
                    style={{ margin: 0 }}
                  />
                  <span>
                    <span className={`switch-btn ${!isHcp ? "active" : ""}`}>
                      Octapharma
                    </span>
                    <span className={`switch-btn ${isHcp ? "active" : ""}`}>
                      HCP
                    </span>
                  </span>
                  <a className="btn"></a>
                </label>
              </div>
              <div className="logout">
                <span>
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault(); // stop default link navigation
                      logout();
                    }}
                  >
                    Log out
                  <div className="user-avatar">
                    <img src={path_image + "logout.svg"} alt="user" />
                  </div>
                  </Link>
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
