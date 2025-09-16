import React from 'react'
import { Col } from 'react-bootstrap'

export default function FooterItems({ handleSectionClicked }) {
    const data = [
        {
            class: "faq",
            title: "FAQ",
            subtitle: "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper."
        },
        {
            class: "latest-content",
            title: "Latest content",
            subtitle: "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper."
        },
        {
            class: "ask-ibu",
            title: "Ask IBU",
            subtitle: "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper."
        }
    ]

    return (
        data.map((item, index) => (
            <Col key={index} className={item.class}>
                <div className='explore-box' onClick={handleSectionClicked ? () => {
                    handleSectionClicked(item)
                } : null}>
                    <h6>{item.title}</h6>
                    <p>{item.subtitle}</p>
                </div>
            </Col>
        ))
    )
}
