import React from 'react'
import { Row } from 'react-bootstrap';
import Header from '../Common/Header'; 
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
const Account = () => {
    const path_image = import.meta.env.VITE_IMAGES_PATH
    return (
        <div className="main-page">
            <Header />
            <div className="custom-container">
                <Row>
                    <div className="account-section">
                        <div className="profile">
                            <div className="profile-img">
                                <img src={path_image + "dummy-circle.svg"} alt="profile" />
                            </div>
                            <div className="profile-content">
                                <h4>User name</h4>
                                <p>Role</p>
                                <p>Region....</p>
                            </div>
                        </div>
                        <div className="content-download">
                            <div className="download">
                                <h4>Content Download</h4>
                                <p>00</p>
                            </div>
                            <div className="shared">
                                <h4>Content Shared</h4>
                                <p>00</p>
                            </div>
                        </div>
                        <div className='account-tabs w-100'>
                            <Tabs
                                defaultActiveKey="recent-view"
                                className="mb-3">
                                <Tab eventKey="recent-view" title="Recently viewed">
                                    <div className='account-tabs-content'>
                                        <h6>Recently viewed</h6>
                                    </div>
                                    
                                </Tab>
                                <Tab eventKey="favorite" title="Favorite">
                                    Recently Favorite
                                </Tab>
                                <Tab eventKey="question" title="Your questions">
                                    Recently Question
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </Row>
            </div>
        </div>
    )
}

export default Account