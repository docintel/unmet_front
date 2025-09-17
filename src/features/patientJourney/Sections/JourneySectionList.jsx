import React from "react";
import { Col } from "react-bootstrap";

export default function JourneySectionList({ onSectionClick, section }) {
  const data = [
    {
      class: "explore",
      title: "Explore your patient's Journey",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper.",
    },
    {
      class: "faq",
      title: "FAQ",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper.",
    },
    {
      class: "latest-content",
      title: "Latest content",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper.",
    },
    {
      class: "ask-ibu",
      title: "Ask IBU",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper.",
    },
  ];

  return data.map((item, index) => {
    console.log(item.class , section?.class)
    if (item.class == "explore" && !section) return null;
    if (item.class == section?.class) return null;

    return (
      <Col key={index} className={item.class}>
        <div
          className="explore-box"
          onClick={
            onSectionClick
              ? () => {
                  onSectionClick(item);
                }
              : null
          }
        >
          <h6>{item.title}</h6>
          <p>{item.subtitle}</p>
        </div>
      </Col>
    );
  });
}
