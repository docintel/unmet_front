import React, { useState } from 'react'
import { Button, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Header from '../Common/Header'; 
import Dropdown from 'react-bootstrap/Dropdown';
const TouchPoints = () => {
    const path_image = import.meta.env.VITE_IMAGES_PATH
    const [isAllSelected, setIsAllSelected] = useState(false);
    const toggleUserType = () => setIsAllSelected((prev) => !prev);
    const [activeKey, setActiveKey] = useState(null); // no tab selected initially
     const [activeJourney, setActiveJourney] = useState(null); // no journey selected initially
     const journeyLabels = [
        "Childhood<br />Age 0-5",
        "Childhood<br />Age 6-11",
        "Teen years<br />Age 12-17",
        "Early adulthood<br />Age 18-25",
        "Adulthood<br />Age 26-60",
        "Older age<br />Age 60+",
    ];

    const touchpointContent = [
        {
            ageTags: [
                { label: "Age 0-5", class: "age0" },
                { label: "Age 6-11", class: "age6" },
            ],
            format: "Video",
            heading: "Sebaga, diagnosed 7 years, VWD Type 3, many diagnosis difficultues",
            subheading: "Surviving the unknown - von Willebrand disease (VWD)",
            tags: ["awareness", "education", "providers", "HMB", "VWD"],
            date: "12.August.2025",
            likeArticle: "128",
        },
        {
            ageTags: [
                { label: "Age 18-25", class: "age18" },
                { label: "Age 26-60", class: "age26" },
            ],
            format: "Manuscript",
            heading: "Maria, living with VWD Type 1, diagnosed at 14, sharing her journey",
            subheading: "Breaking the silence – challenges and hope in managing VWD",
            tags: ["advocacy", "youth", "HMB", "bleedingdisorders", "support"],
            date: "03.September.2025",
            likeArticle: "256",
        },
        {
            ageTags: [
                { label: "Age 6-11", class: "age6" },
            ],
            format: "Slide deck",
            heading: "James & family – navigating childhood VWD Type 2",
            subheading: "A parent’s perspective on raising a child with von Willebrand disease",
            tags: ["parents", "family", "children", "education", "VWD"],
            date: "21.July.2025",
            likeArticle: "342",
        },
        {
            ageTags: [
                { label: "Age 26-60", class: "age26" },
                { label: "Age 60+", class: "age60" },
            ],
            format: "Video",
            heading: "Dr. Lee – improving early detection of von Willebrand disease",
            subheading: "Why awareness among providers can change patient outcomes",
            tags: ["awareness", "education", "providers", "diagnosis", "research"],
            date: "29.June.2025",
            likeArticle: "415",
        }
    ];
    return (
        <>
            <div className="main-page">
                <Header />
                <div className="custom-container">
                    <Row>
                        <div className='touchpoints-section'>
                            <div className="patient-journey d-flex align-items-center w-100">
                                <div className="switch">
                                    <label className="switch-light">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={toggleUserType}
                                            style={{ margin: 0 }}
                                        />
                                        <span>
                                            <span className={`switch-btn ${!isAllSelected ? "active" : ""}`}>All</span>
                                            <span className={`switch-btn ${isAllSelected ? "active" : ""}`}>Female</span>
                                        </span>
                                        <a className="btn"></a>
                                    </label>
                                </div>
                                <div className='journey-link-list d-flex align-items-center justify-content-between w-100'>
                                    {/* {[
                                        <div className="active">Childhood<br />Age 0-5</div>,
                                        <div>Childhood<br />Age 6-11</div>,
                                        <div>Teen years<br />Age 12-17</div>,
                                        <div>Early adulthood<br />Age 18-25</div>,
                                        <div>Adulthood<br />Age 26-60</div>,
                                        <div>Older age<br />Age 60+</div>,
                                    ].map((label, idx) => (
                                        <React.Fragment key={idx}>
                                            <div className="journey-link">{label}</div>
                                            {idx !== 5 && <div className="line"></div>}
                                        </React.Fragment>
                                    ))} */}
                                    {journeyLabels.map((label, idx) => (
                                        <React.Fragment key={idx}>
                                            <div
                                                className={`journey-link ${activeJourney === idx ? "active" : ""}`}
                                                // dangerouslySetInnerHTML={{ __html: label }}
                                                onClick={() => setActiveJourney(idx)}
                                            >
                                                <div dangerouslySetInnerHTML={{ __html: label }}></div>
                                            </div>
                                            {idx !== journeyLabels.length - 1 && <div className="line"></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            <div className="touchpoint-box">
                                <div className='touchpoints-header'>
                                    <Tabs
                                        activeKey={activeKey}
                                        onSelect={(k) => setActiveKey(k)}
                                        fill
                                    >
                                        <Tab eventKey="home" title="Diagnosis">
                                            {activeKey === "home" ?
                                                <div className='touchpoint-data'>
                                                    <h6>Short Narrative</h6>
                                                    <div className='d-flex justify-content-between narrative-block'>
                                                        <div className='content'>
                                                            <p>Challenges and unmet needs</p>
                                                            <ul>
                                                                <li>Increased opportunities to observe bleeding symptoms (e.g. increased sport and activity levels, dental and orthodontic work, onset of menstrual bleeding)</li>
                                                                <li>Nonspecific symptoms (e.g., bruising, nosebleeds, oral bleeds) may seem common for adolescents with increased risk-taking behaviour and be under-recognized, especially in the absence of family history</li>
                                                                <li>Often no family history of VWD, especially in de novo Type 3 cases</li>
                                                                <li>VWF levels may fluctuate due to hormones, stress, infections, and other factors, making clear confirmation or exclusion of VWD difficult</li>
                                                            </ul>
                                                        </div>
                                                        <div className='content'>
                                                            <p>Octapharma's contribution</p>
                                                            <ul>
                                                                <li>Supports VWDtest.com, a global awareness platform offering resources for early symptom recognition and timely referral</li>
                                                                <li>Provides caregiver and HCP resources to recognize signs and seek appropriate testing</li>
                                                                <li>Offers a VWD genotyping service for early, accurate, and personalized diagnosis and treatment
                                                                    <ul>
                                                                        <li>Enables early identification of affected siblings before symptoms arise</li>
                                                                        <li>Useful for surgical planning or trauma preparedness</li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                : null}
                                        </Tab>
                                        <Tab eventKey="surgery" title="Surgery">
                                            {activeKey === "surgery" ?
                                                <div className='touchpoint-data'>Tab content for Profile</div> : null}
                                        </Tab>
                                        <Tab eventKey="pregnancy" title="Pregnancy & childbirth">
                                            {activeKey === "pregnancy" ?
                                                <div className='touchpoint-data'>Tab content for Loooonger Tab</div> : null}
                                        </Tab>
                                        <Tab eventKey="bone" title="Joint & bone health">
                                            {activeKey === "bone" ?
                                                <div className='touchpoint-data'>Tab content for Contact</div> : null}
                                        </Tab>
                                        <Tab eventKey="hmb" title="HMB">
                                            {activeKey === "hmb" ?
                                                <div className='touchpoint-data'>Tab content for Contact</div> : null}
                                        </Tab>
                                        <Tab eventKey="wilprophy" title="Wilprophy">
                                            {activeKey === "wilprophy" ?
                                                <div className='touchpoint-data'>Tab content for Contact</div> : null}
                                        </Tab>
                                        <Tab eventKey="on-demand" title="On-demand">
                                            {activeKey === "on-demand" ?
                                                <div className='touchpoint-data'>Tab content for Contact</div> : null}
                                        </Tab>
                                    </Tabs>

                                    {/* Default message when no tab is selected */}
                                    {!activeKey && <div className="text-center no_data">Choose the patient’s age and touchpoint from the options above<br />
                                        to access content tailored to their unmet needs.</div>}
                                </div>
                                <div className='search-bar'>
                                    <Form className="d-flex">
                                        <Form.Control
                                            type="search"
                                            aria-label="Search"
                                        />
                                        <Button variant="outline-success"><img src={ path_image + "search-icon.svg"} alt="Search" /></Button>
                                    </Form>
                                </div>
                                <div className="tags d-flex align-items-center">
                                    <div className='tag-title'>Tags:</div>
                                    <div className='tag-list d-flex'>
                                        {["Awareness", "Education", "Providers", "HMB", "VWD", "Advocacy", "Youth", "Bleeding Disorders", "Support", "Parents", "Family", "Children", "Diagnosis", "Research"].map((tag, idx) => (
                                            <div className="tag-item" key={idx}>{tag}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="content-count-box">
                                    <div className='content-count'>
                                        <div className='all'>All<br />324</div>
                                        <div>slide deck<br />32</div>
                                        <div>videos<br />102</div>
                                        <div>manuscript<br />51</div>
                                        <div>Flyer<br />88</div>
                                        <div>FAQ<br />2</div>
                                    </div>
                                    <div className='touchpoint-data-boxes'>
                                        {
                                            touchpointContent.map((section) => (
                                                <>
                                                    <div className='touchpoint-data-box'>
                                                        <div className="age-format d-flex">
                                                            {section.ageTags.map((tag) => (<div className={tag.class}>
                                                                {tag.label}
                                                            </div>))}
                                                        </div>

                                                        <div className='content-box'>
                                                            <div className="format">
                                                                <div className='d-flex align-items-center'>
                                                                    <img src={path_image + "dummy-format-img.png"} alt="" />
                                                                    <p>{section.format}</p>
                                                                </div>

                                                                <Dropdown align="end" >
                                                                    <Dropdown.Toggle>
                                                                        <img src={path_image + "search-icon.svg"} alt="dropdown" />
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item>Share</Dropdown.Item>
                                                                        <Dropdown.Item>Request</Dropdown.Item>
                                                                        <Dropdown.Item>Copy Link</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                            <div className="heading">
                                                                {section.heading}
                                                            </div>
                                                            <div className="subheading">
                                                                {section.subheading}
                                                            </div>
                                                            <div className="tags tag-list">
                                                                {section.tags.map((tag) => (<div>
                                                                    {tag}
                                                                </div>))}
                                                            </div>
                                                            <div className="date">
                                                                {section.date}
                                                            </div>
                                                            <div className="favorite d-flex justify-content-between align-sections-center">
                                                                <div className='d-flex align-sections-center'>
                                                                    <img src={path_image + "star-img.svg"} alt="" />
                                                                    {section.likeArticle}
                                                                </div>
                                                                <Button variant="primary">Read</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default TouchPoints