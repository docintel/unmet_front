import React from 'react'
import { Button, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap'
import FooterItems from './FooterItems';
import Close from '../assets/images/close-arrow.svg'
import formatImg from '../assets/images/dummy-format-img.png'
import starImg from '../assets/images/star-img.svg'
import optionImg from '../assets/images/options.svg'

export default function FooterExpand({ handleSectionClicked, item }) {
    // const rightSideData = [
    //     {
    //         question:
    //             "Q. Porttitor ultrices hendrerit consectetur et a pulvinar ac etiam vel. Tristique donec lobortis id sed. Vel id urna tellus tristique aliquam morbi Crassed?",
    //         region: "LATAM",
    //         country: "Brazil",
    //         tags: ["diagnosis", "women", "girls", "HMB", "VWDtest"],
    //         answer:
    //             "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar facilisis rhoncus vel morbi ullamcorper. Porttitor ultrices hendrerit consectetur et a pulvinar ac etiam vel. Tristique donec lobortis id sed. Vel id urna tellus tristique aliquam morbi. Cras sed viverra et arcu lorem viverra.",
    //         date: "29.July.2025",
    //     },
    //     {
    //         question:
    //             "Q. How can clinicians identify early symptoms of von Willebrand Disease (VWD) in adolescent girls presenting with heavy menstrual bleeding (HMB)?",
    //         region: "APAC",
    //         country: "India",
    //         tags: ["VWD", "adolescents", "HMB", "screening"],
    //         answer:
    //             "Early symptoms often include prolonged or heavy menstrual bleeding, easy bruising, and frequent nosebleeds. Clinicians should take a detailed family and menstrual history and consider specific tests such as von Willebrand factor activity, antigen levels, and factor VIII assays to confirm the diagnosis.",
    //         date: "05.August.2025",
    //     },
    //     {
    //         question:
    //             "Q. What strategies can healthcare providers use to raise awareness about HMB and VWD in women of reproductive age?",
    //         region: "EMEA",
    //         country: "Germany",
    //         tags: ["awareness", "education", "providers", "HMB", "VWD"],
    //         answer:
    //             "Healthcare providers can promote awareness by integrating menstrual health discussions into routine check-ups, conducting community education programs, and collaborating with patient advocacy groups. Disseminating updated clinical guidelines through medical associations and digital platforms also plays a crucial role.",
    //         date: "12.August.2025",
    //     },
    // ];

    const faq = [
        {
            ageTags: ["Age 0-5", "Age 6-11", "Age 12-17", "Age 18-25", "Age 26-60", "Age 60+"],
            format: "Video",
            heading: "Sebaga, diagnosed 7 years, VWD Type 3, many diagnosis difficultues",
            subheading: "Surviving the unknown - von Willebrand disease (VWD)",
            tags: ["awareness", "education", "providers", "HMB", "VWD"],
            date: "12.August.2025",
            likeArticle: "128",
        },
        {
            ageTags: ["Age 18-25", "Age 26-60"],
            format: "Manuscript",
            heading: "Maria, living with VWD Type 1, diagnosed at 14, sharing her journey",
            subheading: "Breaking the silence – challenges and hope in managing VWD",
            tags: ["advocacy", "youth", "HMB", "bleedingdisorders", "support"],
            date: "03.September.2025",
            likeArticle: "256",
        },
        {
            ageTags: ["Age 6-11", "Age 12-17"],
            format: "Slide deck",
            heading: "James & family – navigating childhood VWD Type 2",
            subheading: "A parent’s perspective on raising a child with von Willebrand disease",
            tags: ["parents", "family", "children", "education", "VWD"],
            date: "21.July.2025",
            likeArticle: "342",
        },
        {
            ageTags: ["Age 26-60", "Age 60+"],
            format: "Video",
            heading: "Dr. Lee – improving early detection of von Willebrand disease",
            subheading: "Why awareness among providers can change patient outcomes",
            tags: ["awareness", "education", "providers", "diagnosis", "research"],
            date: "29.June.2025",
            likeArticle: "415",
        }
    ];

    return (
        <div className={`journey-box d-flex ${item.class != "ask-ibu" ? "flex-row-reverse" : ""}`}>
            <div className="left-side">
                <FooterItems />
            </div>
            <div className="right-side">
                <div className='box-top d-flex justify-content-between'>
                    <div>
                        <h6>{item.title}</h6>
                        <p>Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper. </p>
                    </div>

                    <span onClick={() => {
                        handleSectionClicked(null)
                    }}><img src={Close} alt="" /></span>
                </div>
                {
                    // rightSideData.map((item) => (
                    faq.map((item) => (
                        <>
                            <div className="age-format d-flex">
                                {item.ageTags.map((tag) => (<div>
                                    {tag}
                                </div>))}
                            </div>

                            <div className='content-box'>
                                <div className="format">
                                    <div className='d-flex align-items-center'>
                                        <img src={formatImg} alt="" />
                                        <p>{item.format}</p>
                                    </div>
                                    <>
                                        <Dropdown align="end">
                                    <Dropdown.Toggle>
                                        <img src={optionImg} alt=""/>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item>Share</Dropdown.Item>
                                        <Dropdown.Item>Request</Dropdown.Item>
                                        <Dropdown.Item>Copy Link</Dropdown.Item>
                                    </Dropdown.Menu>
                                    </Dropdown>
                                       
                                    </>
                                </div>
                                <div className="heading">
                                    {item.heading}
                                </div>
                                <div className="subheading">
                                    {item.subheading}
                                </div>
                                <div className="tags tag-list">
                                    {item.tags.map((tag) => (<div>
                                        {tag}
                                    </div>))}
                                </div>
                                <div className="date">
                                    {item.date}
                                </div>
                                <div className="favorite d-flex justify-content-between align-items-center">
                                    <div className='d-flex align-items-center'>
                                        <img src={starImg} alt="" />
                                        {item.likeArticle}
                                    </div>
                                    <Button variant="primary">Read</Button>
                                </div>
                            </div>
                        </>
                    ))
                }

            </div>


        </div>
    )
}
