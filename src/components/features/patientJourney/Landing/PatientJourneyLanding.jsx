import React, { useContext, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import JourneySectionList from "../Sections/JourneySectionList";
import JourneySectionDetail from "../Sections/JourneySectionDetail";
import { ContentContext } from "../../../../context/ContentContext";

const PatientJourneyLanding = () => {
  const { filterAges, fetchAgeGroups } = useContext(ContentContext);
  const [activeSection, setActiveSection] = useState(null);
  // const [isHcpSelected, setIsHcpSelected] = useState(false);

  useEffect(() => {
    (async () => await fetchAgeGroups())();
  });
  // const toggleUserType = () => setIsHcpSelected((prev) => !prev);
  const handleSectionClick = (section) => setActiveSection(section);

  return (
    <div className="main-page">
      <div className="custom-container">
        <Row>
          <section className="journey-box">
            {!activeSection ? (
              <>
                <div className="explore-journey">
                  <h5>Explore your patient's Journey</h5>
                  <div className="patient-journey d-flex align-items-center justify-content-between">
                    {filterAges &&
                      filterAges.map((age, idx) => (
                        <React.Fragment key={age.id}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: age.label,
                            }}
                            className="journey-link"
                          ></div>
                          {}
                          {idx !== filterAges.length - 1 && (
                            <div className="line"></div>
                          )}
                        </React.Fragment>
                      ))}
                  </div>
                  <Link to="/touchpoints" className="start-btn">
                    Start
                  </Link>
                  {/* <Button variant="primary">Start</Button> */}
                </div>
                <JourneySectionList
                  onSectionClick={handleSectionClick}
                  section={activeSection}
                />
              </>
            ) : (
              <JourneySectionDetail
                onSectionClick={handleSectionClick}
                section={activeSection}
              />
            )}
          </section>
        </Row>
      </div>
    </div>
  );
};

export default PatientJourneyLanding;
