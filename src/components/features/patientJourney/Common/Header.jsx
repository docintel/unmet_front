import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Row, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../../../../helper/helper";
import { ContentContext } from "../../../../context/ContentContext";

const Header = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { isHcp, setIsHcp } = useContext(ContentContext);
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 991);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // 🔹 Listen for screen resize and update
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 991);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // const toggleUserType = () => setIsHcpSelected((prev) => !prev);

  const toggleUserType = () => {
    setIsHcp((prev) => {
      const newValue = !prev;
      document.cookie = `isHcp=${newValue}; 1; path=/`;

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
    document.documentElement.setAttribute("data-bs-theme", "light");
    navigate("/");
  };
  const [theme, setTheme] = useState(() => {
    // Check if a theme is already set in localStorage, otherwise default to 'light'
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  // Ensure theme is set on initial render
  useState(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  });
  return (
    <header className="header sticky">
      <div className="custom-container">
        <Row>
          <div className="header-inner d-flex align-items-center justify-content-between w-100">
            <Navbar
              expand="lg"
              variant="light"
              className="nav w-100 justify-content-between"
            >
              <Navbar.Brand href="/">
                <img src={path_image + "vwd-journey-logo.svg"} alt="logo" />
              </Navbar.Brand>

              {/* ✅ Show burger button only on mobile */}

              {/* ✅ Normal inline nav for desktop */}
              {!isMobile && (
                <Nav className="justify-content-center flex-grow-1">
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
              )}

              {/* Right-side account section (always visible) */}
              <div className="header-account d-flex align-items-center">
                <div className="switch me-3">
                  <label className="switch-light">
                    <input
                      type="checkbox"
                      checked={isHcp}
                      onChange={toggleUserType}
                      onClick={toggleTheme}
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
                      <div className="logout-icon">
                        <img src={path_image + "logout.svg"} alt="user" />
                      </div>
                    </Link>
                  </span>
                </div>
                {isMobile && (
                  <Navbar.Toggle
                    aria-controls="offcanvasNavbar"
                    className="custom-toggler"
                    onClick={handleShow}
                  />
                )}
              </div>
            </Navbar>

            {/* ✅ Mobile Offcanvas Drawer */}
            {isMobile && (
              <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                className="custom-offcanvas"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>
                    <img
                      src={path_image + "vwd-journey-logo.svg"}
                      alt="logo"
                      style={{ height: "30px" }}
                    />
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="flex-column text-center">
                    {!isHcp && (
                      <NavLink
                        to="/home"
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        onClick={handleClose}
                      >
                        Home
                      </NavLink>
                    )}
                    <NavLink
                      to="/touchpoints"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                      onClick={handleClose}
                    >
                      Touchpoints
                    </NavLink>
                    <NavLink
                      to="/resources"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                      onClick={handleClose}
                    >
                      Resources
                    </NavLink>
                    {!isHcp && (
                      <NavLink
                        to="/account"
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        onClick={handleClose}
                      >
                        My Account
                      </NavLink>
                    )}
                  </Nav>
                </Offcanvas.Body>
              </Offcanvas>
            )}
          </div>
        </Row>
      </div>
    </header>
  );
};

export default Header;
