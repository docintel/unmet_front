import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Logo from '../../../assets/images/logo-img.svg'
import Avatar  from '../../../assets/images/avtar-icon.png'
import JourneySectionList from '../Sections/JourneySectionList'
import JourneySectionDetail from '../Sections/JourneySectionDetail'


const PatientJourneyLanding = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isHcpSelected, setIsHcpSelected] = useState(false);

  const toggleUserType = () => setIsHcpSelected((prev) => !prev);
  const handleSectionClick = (section) => setActiveSection(section);

  return (
    <div className="main-page">
      <div className="custom-container">
        <Row>
          <header className="header">
            <div className="logo">
              <img src={Logo} alt="logo" />
            </div>
            <nav className="nav">
              <ul>
                <li><Link className="active" to="/">Home</Link></li>
                <li><Link to="/">Touchpoints</Link></li>
                <li><Link to="/">Resources</Link></li>
                <li><Link to="/">My Account</Link></li>
              </ul>
            </nav>
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
          </header>

          <section className="journey-box">
            {!activeSection ? (
              <>
                <div className="explore-journey">
                  <h5>Explore your patient's Journey</h5>
                  <div className="patient-journey d-flex align-items-center justify-content-between">
                    {[
                      "Childhood Age 0-5",
                      "Childhood Age 6-11",
                      "Teen years Age 12-17",
                      "Early adulthood Age 18-25",
                      "Adulthood Age 26-60",
                      "Older age Age 60+",
                    ].map((label, idx) => (
                      <React.Fragment key={idx}>
                        <div className="journey-link">{label}</div>
                        {idx !== 5 && <div className="line"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                  <Button variant="primary">Start</Button>
                </div>
                <JourneySectionList onSectionClick={handleSectionClick} section={activeSection} />
              </>
            ) : (
              <JourneySectionDetail onSectionClick={handleSectionClick} section={activeSection} />
            )}
          </section>
        </Row>
      </div>
    </div>
  );
};

export default PatientJourneyLanding;