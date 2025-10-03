import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function JourneySectionList({ onSectionClick, section }) {
  const navigate = useNavigate();

  const data = [
    {
      class: "explore",
      title: "Explore your patient's Journey",
      // subtitle:
      //   "Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar fcilisis rhoncus vel morbi ullamcorper.",
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
    if (item.class == "explore" && !section) return null;
    if (item.class == section?.class) return null;

    return (
      <Col key={index} className={item.class}>
        <div
          className="explore-box"
          onClick={
            onSectionClick
              ? () => {
                  if (item.class === "explore") {
                    navigate("/touchpoints");
                  }
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
