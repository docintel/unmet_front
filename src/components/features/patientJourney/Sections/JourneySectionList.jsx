import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function JourneySectionList({ onSectionClick, section })
{
  const navigate = useNavigate();
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const data = [
    {
      class: "explore",
      title: "Explore your",
    },
    {
      class: "faq",
      title: "FAQ",
      subtitle:
        "Find quick answers to the most common questions. Browse through organized FAQ files to get instant help and guidance.",
    },
    {
      class: "latest-content",
      title: "Latest content",
      subtitle:
        "Stay up to date with the newest materials added to the VWD Journey. Here you’ll find the five most recently uploaded pieces of content ready for you to explore.",
    },
    {
      class: "ask-ibu",
      title: "Ask IBU",
      subtitle:
        "Have a question? Ask IBU anything related to your field and get clear, reliable answers. You can also explore questions from other users and learn from the shared discussions.",
    },
  ];

  return data.map((item, index) =>
  {
    if (item.class == "explore" && !section) return null;
    if (item.class == section?.class) return null;

    return (
      <Col key={index} className={item.class}>
        <div
          className={"explore-box " + item.class}
          onClick={
            onSectionClick
              ? () =>
              {
                if (item.class === "explore") {
                  navigate("/touchpoints");
                }
                onSectionClick(item);
              }
              : null
          }
        >
          <div className="explore-title">
            <img src={path_image + item.class + ".svg"} alt="" />
            {item.class === "explore" ? <h6 className="heading">{item.title}&nbsp;<span >patient&apos;s Journey</span></h6> : <h6>{item.title}</h6>}
          </div>
          <p>{item.subtitle}</p>
        </div>
      </Col>
    );
  });
}
