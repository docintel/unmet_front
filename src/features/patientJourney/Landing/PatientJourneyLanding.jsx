import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Logo from '../../../assets/images/logo-img.svg'
import Avtar from '../../../assets/images/avtar-icon.png'
import JourneySectionList from '../Sections/JourneySectionList'
import JourneySectionDetail from '../Sections/JourneySectionDetail'


const PatientJourneyLanding = () => {
    const [isSectionClicked, setIsSectionClicked] = useState(null);
    const [isYes, setIsYes] = useState(false)
    const toggle = () => {
        setIsYes((prev) => !prev)
    };

    function handleSectionClicked(id) {
        setIsSectionClicked(id)

    }

    return (
        <div className='main-page'>
            <div className="custom-container">
                <Row>
                    <header className='header'>
                        <div className="logo">
                            <img src={Logo} alt="logo" />
                        </div>
                        <div className="nav">
                            <ul>
                                <li><Link className="active" to="/">Home</Link></li>
                                <li><Link to="/">Touchpoints</Link></li>
                                <li><Link to="/">Resources</Link></li>
                                <li><Link to="/">My Account</Link></li>
                            </ul>
                        </div>
                        <div className='header-account d-flex align-items-center'>
                            <div className="switch">
                                <label className="switch-light">
                                    <input
                                        type="checkbox"
                                        checked={isYes}
                                        onChange={toggle}
                                        style={{ margin: 0 }}
                                    />
                                    <span>
                                        <span className={`switch-btn ${!isYes ? "active" : ""}`}>Octapharma</span>
                                        <span className={`switch-btn ${isYes ? "active" : ""}`}>HCP</span>
                                    </span>
                                    <a className="btn"></a>
                                </label>
                            </div>
                            <div className='logout'>
                                <div className='user-avtar'>
                                    <img src={Avtar} alt='user' />
                                </div>
                                <span><Link to="/">Log Out</Link></span>
                            </div>
                        </div>
                    </header>
                    <section className='journey-box'>
                        {!isSectionClicked ?
                            <><div className='explore-journey'>
                                <h5>Explore your patient's Journey</h5>
                                <div className="patient-journey d-flex align-items-center justify-content-between">
                                    <div className='journey-link'>Childhood<br />Age 0-5</div>
                                    <div className='line'></div>
                                    <div className='journey-link'>Childhood<br />Age 6-11</div>
                                    <div className='line'></div>
                                    <div className='journey-link'>Teen years<br />Age 12-17 </div>
                                    <div className='line'></div>
                                    <div className='journey-link'>Early adulthood<br />Age 18-25</div>
                                    <div className='line'></div>
                                    <div className='journey-link'>Adulthood<br />Age 26-60</div>
                                    <div className='line'></div>
                                    <div className='journey-link'>older age<br />Age 60+</div>
                                </div>
                                <Button variant="primary" type="submit">
                                    Start
                                </Button>

                            </div>
                                <JourneySectionList handleSectionClicked={handleSectionClicked} />
                            </>
                            :
                            <>
                                <JourneySectionDetail handleSectionClicked={handleSectionClicked} item={isSectionClicked} />
                            </>
                        }
                    </section>

                </Row>
            </div>

        </div>
    )
}

export default PatientJourneyLanding