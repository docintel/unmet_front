import React, { useContext, useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import JourneySectionList from "../Sections/JourneySectionList";
import JourneySectionDetail from "../Sections/JourneySectionDetail";
import { ContentContext } from "../../../../context/ContentContext";

const PatientJourneyLanding = () => {
  const { filterAges, fetchAgeGroups } = useContext(ContentContext);
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [activeSection, setActiveSection] = useState(null);
  // const [isHcpSelected, setIsHcpSelected] = useState(false);

  useEffect(() => {
    (async () => await fetchAgeGroups())();
  }, []);
  // const toggleUserType = () => setIsHcpSelected((prev) => !prev);
  const handleSectionClick = (section) => setActiveSection(section);

  return (
    <div className="main-page">
      <div className="container-fluid">
        <Row>
          <section className="journey-box">
            {!activeSection ? (
              <>
                <div className="explore-journey">
                  <div className="filter-age">
                    <h3>Explore your <span>patient's Journey</span></h3>
                    <div className="explore-journey-block">
                      <div className="explore-journey-block-inner">
                    <svg width="1392" height="658" viewBox="0 0 1392 658" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#filter0_d_3825_33335)">
                        <path d="M1296 238.1C1319.55 238.1 1342.14 247.414 1358.79 263.992C1375.42 280.547 1384.77 302.991 1384.8 326.4C1384.8 326.455 1384.84 326.5 1384.9 326.5C1384.96 326.5 1385 326.545 1385 326.6C1385.01 338.403 1386.92 350.01 1390.55 361.018C1391.46 363.748 1392 366.592 1392 369.468V634C1392 647.255 1381.25 658 1368 658H24C10.7452 658 0 647.255 0 634V369.468C0 366.592 0.543161 363.748 1.44523 361.018C5.08145 350.01 6.98922 338.403 6.99995 326.6C7 326.545 7.04482 326.5 7.1001 326.5C7.15538 326.5 7.20019 326.455 7.20025 326.4C7.22688 302.991 16.5796 280.547 33.209 263.992C49.8622 247.414 72.4488 238.1 96 238.1C119.551 238.1 142.138 247.414 158.791 263.992C175.42 280.547 184.773 302.991 184.8 326.4C184.8 326.455 184.845 326.5 184.9 326.5C184.955 326.5 185 326.545 185 326.6C185.027 355.87 196.718 383.937 217.511 404.636C238.327 425.359 266.561 437 296 437C325.439 437 353.673 425.358 374.489 404.636C395.282 383.937 406.973 355.87 407 326.6C407 326.545 407.045 326.5 407.1 326.5C407.155 326.5 407.2 326.455 407.2 326.4C407.227 302.991 416.58 280.547 433.209 263.992C449.862 247.414 472.449 238.1 496 238.1C519.551 238.1 542.138 247.414 558.791 263.992C575.42 280.547 584.773 302.991 584.8 326.4C584.8 326.455 584.845 326.5 584.9 326.5C584.955 326.5 585 326.545 585 326.6C585.027 355.87 596.718 383.937 617.511 404.636C638.327 425.359 666.561 437 696 437C725.439 437 753.673 425.358 774.489 404.636C795.282 383.937 806.973 355.87 807 326.6C807 326.545 807.045 326.5 807.1 326.5C807.155 326.5 807.2 326.455 807.2 326.4C807.227 302.991 816.58 280.547 833.209 263.992C849.862 247.414 872.449 238.1 896 238.1C919.551 238.1 942.138 247.414 958.791 263.992C975.42 280.547 984.773 302.991 984.8 326.4C984.8 326.455 984.845 326.5 984.9 326.5C984.955 326.5 985 326.545 985 326.6C985.027 355.87 996.718 383.937 1017.51 404.636C1038.33 425.359 1066.56 437 1096 437C1125.44 437 1153.67 425.358 1174.49 404.636C1195.28 383.937 1206.97 355.87 1207 326.6C1207 326.545 1207.04 326.5 1207.1 326.5C1207.16 326.5 1207.2 326.455 1207.2 326.4C1207.23 302.991 1216.58 280.547 1233.21 263.992C1249.86 247.414 1272.45 238.1 1296 238.1ZM1368 0C1381.25 0 1392 10.7452 1392 24V242.307C1392 250.23 1380.1 253.954 1374.49 248.364C1353.67 227.642 1325.44 216 1296 216C1266.56 216 1238.33 227.641 1217.51 248.364C1196.72 269.063 1185.03 297.13 1185 326.4C1185 326.455 1184.96 326.5 1184.9 326.5C1184.84 326.5 1184.8 326.545 1184.8 326.6C1184.77 350.009 1175.42 372.453 1158.79 389.008C1142.14 405.586 1119.55 414.9 1096 414.9C1072.45 414.9 1049.86 405.586 1033.21 389.008C1016.58 372.453 1007.23 350.009 1007.2 326.6C1007.2 326.545 1007.16 326.5 1007.1 326.5C1007.04 326.5 1007 326.455 1007 326.4C1006.97 297.13 995.282 269.063 974.489 248.364C953.673 227.642 925.439 216 896 216C866.561 216 838.327 227.641 817.511 248.364C796.718 269.063 785.027 297.13 785 326.4C785 326.455 784.955 326.5 784.9 326.5C784.845 326.5 784.8 326.545 784.8 326.6C784.773 350.009 775.42 372.453 758.791 389.008C742.138 405.586 719.551 414.9 696 414.9C672.449 414.9 649.862 405.586 633.209 389.008C616.58 372.453 607.227 350.009 607.2 326.6C607.2 326.545 607.155 326.5 607.1 326.5C607.045 326.5 607 326.455 607 326.4C606.973 297.13 595.282 269.063 574.489 248.364C553.673 227.642 525.439 216 496 216C466.561 216 438.327 227.641 417.511 248.364C396.718 269.063 385.027 297.13 385 326.4C385 326.455 384.955 326.5 384.9 326.5C384.845 326.5 384.8 326.545 384.8 326.6C384.773 350.009 375.42 372.453 358.791 389.008C342.138 405.586 319.551 414.9 296 414.9C272.449 414.9 249.862 405.586 233.209 389.008C216.58 372.453 207.227 350.009 207.2 326.6C207.2 326.545 207.155 326.5 207.1 326.5C207.045 326.5 207 326.455 207 326.4C206.973 297.13 195.282 269.063 174.489 248.364C153.673 227.642 125.439 216 96 216C66.561 216 38.3273 227.641 17.5107 248.364C11.8958 253.954 0 250.23 0 242.307V24C1.03081e-06 10.7452 10.7452 0 24 0H1368Z" fill="#1D3F50" />
                      </g>
                      <defs>
                        <filter id="filter0_d_3825_33335" x="-10.8" y="-10.8" width="1413.6" height="679.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                          <feFlood flood-opacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset />
                          <feGaussianBlur stdDeviation="5.4" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3825_33335" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3825_33335" result="shape" />
                        </filter>
                      </defs>
                    </svg>
                    <div className="age-filter-block">
                        <div className="block age0">
                          <p>Early Childhood</p>
                          <div className="line"></div>
                          <div className="age-group-circle">
                            <img src={path_image + "ages/early_childhood_all.png"} alt=""/>
                          </div>
                          <div className="age-gap">
                            &#60; 6
                          </div>
                        </div>
                        <div className="block age6">
                          <p>Childhood</p>
                          <div className="line"></div>
                          <div className="age-group-circle">
                            <img src={path_image + "ages/childhood_all.png"} alt=""/>
                          </div>
                          <div className="age-gap">
                            6-11
                          </div>
                        </div>
                        <div className="block age12">
                          <p>Teen years</p>
                          <div className="line"></div>
                          <div className="age-group-circle">
                            <img src={path_image + "ages/teen_years_all.png"} alt=""/>
                          </div>
                          <div className="age-gap">
                            12-17
                          </div>
                        </div>
                        <div className="block age18">
                          <p>Young adulthood</p>
                          <div className="line"></div>
                          <div className="age-group-circle">
                            <img src={path_image + "ages/young_adulthood_all.png"} alt=""/>
                          </div>
                          <div className="age-gap">
                            18-25
                          </div>
                        </div>
                        <div className="block age26">
                          <p>Adulthood</p>
                          <div className="line"></div>
                          <div className="age-group-circle">
                            <img src={path_image + "ages/adulthood_all.png"} alt=""/>
                          </div>
                          <div className="age-gap">
                            &#62; 26
                          </div>
                        </div>
                    </div>
                    </div>
                    <div className="explore-btn">
                      <Link to="/touchpoints" className="btn-primary">
                        Start exploring
                        <img src={path_image + "left-arrow-white.svg"} alt="" />
                      </Link>
                    </div>
                    </div>
                  </div>
                  {/* <div className="patient-journey d-flex align-items-center justify-content-between">
                    {filterAges.loading ? (
                      <></>
                    ) : filterAges.error ? (
                      <></>
                    ) : (
                      filterAges.data &&
                      filterAges.data.length > 0 &&
                      filterAges.data.map((age, idx) => (
                        <React.Fragment key={age.id}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: age.label,
                            }}
                            className="journey-link"
                          ></div>
                          {}
                          {idx !== filterAges.data.length - 1 && (
                            <div className="line"></div>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </div> */}


                  {/* <Button variant="primary">Start</Button> */}
                </div>
                <div className="journey-box-right">
                <JourneySectionList
                  onSectionClick={handleSectionClick}
                  section={activeSection}
                />

                </div>
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
