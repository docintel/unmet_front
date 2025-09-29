import React from 'react'
import JourneySectionList from './JourneySectionList';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import AskIBU from './AskIBU';
import FaqAndLatestContent from './FaqAndLatestContent';

export default function JourneySectionDetail({ onSectionClick, section }) {
    const path_image = import.meta.env.VITE_IMAGES_PATH
    return (
        <div className={`journey-box d-flex ${section.class != "ask-ibu" ? "flex-row-reverse" : ""}`}>
            <div className="left-side">
                <JourneySectionList onSectionClick={onSectionClick} section={section} />
            </div>

            <div className="right-side">
                <div className='box-top d-flex justify-content-between'>
                    <div>
                        <h6>{section.title}</h6>
                        <p>Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper. </p>
                    </div>

                    <span onClick={() => {
                        onSectionClick(null)
                    }}><img src={path_image + "close-arrow.svg"} alt="" /></span>
                </div>

                <div className="data-box">
                    {section.class === "ask-ibu" ? (
                        <AskIBU />
                    ) : section.class === "faq" ? (
                        <FaqAndLatestContent />
                    ) : section.class === "latest-content" ? <FaqAndLatestContent /> : null}
                </div>
            </div>
        </div>
    )
}
