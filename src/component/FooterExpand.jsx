import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import FooterItems from './FooterItems';
import Close from '../assets/images/close-arrow.svg'

export default function FooterExpand({ handleSectionClicked ,item}) {
    const rightSideData = [
        {
            class: "faq",
            question:
                "Q. Porttitor ultrices hendrerit consectetur et a pulvinar ac etiam vel. Tristique donec lobortis id sed. Vel id urna tellus tristique aliquam morbi Crassed?",
            region: "LATAM",
            country: "Brazil",
            tags: ["diagnosis", "women", "girls", "HMB", "VWDtest"],
            answer:
                "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar facilisis rhoncus vel morbi ullamcorper. Porttitor ultrices hendrerit consectetur et a pulvinar ac etiam vel. Tristique donec lobortis id sed. Vel id urna tellus tristique aliquam morbi. Cras sed viverra et arcu lorem viverra.",
            date: "29.July.2025",
        },
        {
            class: "faq",
            question:
                "Q. How can clinicians identify early symptoms of von Willebrand Disease (VWD) in adolescent girls presenting with heavy menstrual bleeding (HMB)?",
            region: "APAC",
            country: "India",
            tags: ["VWD", "adolescents", "HMB", "screening"],
            answer:
                "Early symptoms often include prolonged or heavy menstrual bleeding, easy bruising, and frequent nosebleeds. Clinicians should take a detailed family and menstrual history and consider specific tests such as von Willebrand factor activity, antigen levels, and factor VIII assays to confirm the diagnosis.",
            date: "05.August.2025",
        },
        {
            class: "faq",
            question:
                "Q. What strategies can healthcare providers use to raise awareness about HMB and VWD in women of reproductive age?",
            region: "EMEA",
            country: "Germany",
            tags: ["awareness", "education", "providers", "HMB", "VWD"],
            answer:
                "Healthcare providers can promote awareness by integrating menstrual health discussions into routine check-ups, conducting community education programs, and collaborating with patient advocacy groups. Disseminating updated clinical guidelines through medical associations and digital platforms also plays a crucial role.",
            date: "12.August.2025",
        },
    ];

    return (
        <div className={`journey-box d-flex ${item.class!="ask-ibu" ? "flex-row-reverse" : ""}`}>
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
                    }}><img src={Close} alt=""/></span>
                </div>
                {
                    rightSideData.map((item) => (
                        <div className='content-box'>
                            <div className="question">
                                {item.question}
                            </div>
                            <div className="region">
                                {item.region} ,{item.country}
                            </div>
                            <div className="tags">
                                {item.tags.map((tag) => (<div>
                                    {tag}
                                </div>))}
                            </div>
                            <div className="answer">
                                <span>Answer:</span>
                                {item.answer}
                            </div>
                            <div className="date">
                                {item.date}
                            </div>
                        </div>
                    ))
                }

            </div>


        </div>
    )
}
