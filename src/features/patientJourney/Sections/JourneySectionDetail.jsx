import React from 'react'
import JourneySectionList from './JourneySectionList';
import Close from '../../../assets/images/close-arrow.svg'
import formatImg from '../../../assets/images/dummy-format-img.png'
import starImg from '../../../assets/images/star-img.svg'
import optionImg from '../../../assets/images/options.svg'
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import AskIBU from './AskIBU';
import StarFilled from '../../../assets/images/star-filled.svg'

export default function JourneySectionDetail({ onSectionClick, section }) {


    const faq = [
        {
            ageTags: [
                { label: "Age 0-5", class: "age0" },
                { label: "Age 6-11", class: "age6" },
                { label: "Age 12-17", class: "age12" },
                { label: "Age 18-25", class: "age18" },
                { label: "Age 26-60", class: "age26" },
                { label: "Age 60+", class: "age60" },
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

    const [likedIndexes, setLikedIndexes] = React.useState([]);

    const handleStarClick = (index) => {
        setLikedIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className={`journey-box d-flex ${section.class != "ask-ibu" ? "flex-row-reverse" : ""}`}>
            <div className="left-side">
                <JourneySectionList section={section} />
            </div>

            <div className="right-side">
                <div className='box-top d-flex justify-content-between'>
                    <div>
                        <h6>{section.title}</h6>
                        <p>Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper. </p>
                    </div>

                    <span onClick={() => {
                        onSectionClick(null)
                    }}><img src={Close} alt="" /></span>
                </div>
                

                {section.class === "ask-ibu" ? (
                    <AskIBU />
                ) : section.class === "faq" ? (

                    faq.map((section, idx) => (
                        <div className='detail-data-box' key={idx}>
                            <div className="age-format d-flex">
                                {section.ageTags.map((tag, tagIdx) => (<div className={tag.class} key={tagIdx}>
                                    {tag.label}
                                </div>))}
                            </div>

                            <div className='content-box'>
                                <div className="format">
                                    <div className='d-flex align-items-center'>
                                        <img src={formatImg} alt="" />
                                        <p>{section.format}</p>
                                    </div>

                                    <Dropdown align="end" >
                                        <Dropdown.Toggle>
                                            <img src={optionImg} alt="dropdown" />
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
                                    {section.tags.map((tag, tagIdx) => (<div key={tagIdx}>
                                        {tag}
                                    </div>))}
                                </div>
                                <div className="date">
                                    {section.date}
                                </div>
                                <div className="favorite d-flex justify-content-between align-sections-center">
                                    <div className='d-flex align-sections-center'>
                                        <img
                                            src={likedIndexes.includes(idx)
                                                ? StarFilled
                                                : starImg}
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleStarClick(idx)}
                                        />
                                        {section.likeArticle}
                                    </div>
                                    <Button variant="primary">Read</Button>
                                </div>
                            </div>
                        </div>
                    ))


                ) : null}
                </div>
            </div>
    )
}
