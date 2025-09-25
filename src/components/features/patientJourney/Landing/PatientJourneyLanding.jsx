import React, { useState } from 'react'
import { Row } from 'react-bootstrap'
import {Link} from 'react-router-dom' 
import JourneySectionList from '../Sections/JourneySectionList'
import JourneySectionDetail from '../Sections/JourneySectionDetail'
import Header from '../Common/Header'


const PatientJourneyLanding = () => {
  const [activeSection, setActiveSection] = useState(null);
  // const [isHcpSelected, setIsHcpSelected] = useState(false);

  // const toggleUserType = () => setIsHcpSelected((prev) => !prev);
  const handleSectionClick = (section) => setActiveSection(section);

  return (
    <div className="main-page">
      <Header />
      <div className="custom-container">
        <Row>
          <section className="journey-box">
            {!activeSection ? (
              <>
                <div className="explore-journey">
                  <h5>Explore your patient's Journey</h5>
                  <div className="patient-journey d-flex align-items-center justify-content-between">
                    {[
                      <span>
                        Childhood
                        <br />
                        Age 0-5
                      </span>,
                       <span>Childhood<br />Age 6-11</span>,
                       <span>Teen years<br />Age 12-17</span>,
                      <span>Early adulthood<br />Age 18-25</span>,
                      <span>Adulthood<br />Age 26-60</span>,
                      <span>Older age<br />Age 60+</span>,
                    ].map((label, idx) => (
                      <React.Fragment key={idx}>
                        <div className="journey-link">{label}</div>
                        {idx !== 5 && <div className="line"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                  <Link to="/touchpoints" className="start-btn">Start</Link>
                  {/* <Button variant="primary">Start</Button> */}
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