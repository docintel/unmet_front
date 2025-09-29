import { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import { updateContentRating } from "../../../../services/touchPointServices";

const Content = (props) => {
  const [section, setSection] = useState(props.section);
  const [idx, setIdx] = useState(props.idx);
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { updateRating } = useContext(ContentContext);

  const handleStarClick = async () => {
    if (!section.self_rate) {
      try {
        const response = await updateContentRating(section.id);
        updateRating(section.id, response.response);
        setSection({
          ...section,
          ...{ self_rate: 1, rating: response.response },
        });
      } catch (ex) {}
    }
  };

  const getAgeGroup = () => {
    const tags = JSON.parse(section.age_groups);
    const formattedTags = [];
    tags.map((tag) => {
      const tagClass = tag.slice(0, 6).replace(/[\s-]/g, "").toLowerCase();
      formattedTags.push({ tagLabel: tag, tagClass: tagClass });
    });
    return formattedTags;
  };

  const handleReadClick = (e) => {
    e.preventDefault();
    window.open(section.previewArticle, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="detail-data-box" key={idx}>
      <div className="age-format d-flex">
        {getAgeGroup().map((tag, tagIdx) => (
          <div className={tag.tagClass} key={tagIdx}>
            {tag.tagLabel}
          </div>
        ))}
      </div>

      <div className="content-box">
        <div className="format">
          <div className="d-flex align-items-center">
            <img src={section.category_icon} alt="" />
            <p>{section.category}</p>
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle>
              <img src={path_image + "options.svg"} alt="dropdown" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>Share</Dropdown.Item>
              <Dropdown.Item>Request</Dropdown.Item>
              <Dropdown.Item>Copy Link</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="heading">{section.title}</div>
        <div className="subheading">{section.pdf_sub_title}</div>
        <div className="tags tag-list">
          {JSON.parse(section.tags).map((tag, idx) => (
            <div key={idx}>{tag}</div>
          ))}
        </div>
        <div className="date">{section.creation_date}</div>
        <div className="favorite d-flex justify-content-between align-sections-center">
          <div className="d-flex align-sections-center">
            <img
              src={
                path_image +
                (section.self_rate ? "star-filled.svg" : "star-img.svg")
              }
              alt=""
              style={{ cursor: "pointer" }}
              onClick={handleStarClick}
            />
            {section.rating}
          </div>
          <Button variant="primary" onClick={handleReadClick}>
            Read
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Content;
