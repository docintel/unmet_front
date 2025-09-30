import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import { updateContentRating } from "../../../../services/touchPointServices";
import IframeComponent from "./IframeComponent";
import { toast } from "react-toastify";

const Content = ({
  section: initialSection,
  idx,
  currentReadClick,
  setCurrentReadClick,
}) => {
  const [section, setSection] = useState(initialSection);
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { updateRating, setIsLoading } = useContext(ContentContext);
  const iframeRef = useRef(null);

  const handleStarClick = async () => {
    setIsLoading(true);
    try {
      const response = await updateContentRating(section.id);
      updateRating(section.id, response.response);
      setSection({
        ...section,
        self_rate: section.self_rate === 1 ? 0 : 1,
        rating: response.response,
      });
      if (section.self_rate !== 1) {
        toast("Rating saved successfully");
        setIsLoading(false);
      } else {
        toast("Rating removed successfully");
        setIsLoading(false);
      }
    } catch (ex) {}
  };

  useEffect(() => {
    if (currentReadClick.id === section.id && iframeRef.current) {
      iframeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentReadClick, section.id]);

  const getAgeGroup = () => {
    const tags = JSON.parse(section.age_groups);
    return tags.map((tag) => ({
      tagLabel: tag,
      tagClass: tag.slice(0, 6).replace(/[\s-]/g, "").toLowerCase(),
    }));
  };

  const handleReadClick = (e, link, id) => {
    e.preventDefault();
    // If clicking same article, toggle off
    if (currentReadClick.id === id) {
      setCurrentReadClick({ previewArticle: null, id: null });
    } else {
      setCurrentReadClick({ previewArticle: link, id });
    }
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
          <Button
            variant="primary"
            onClick={(e) =>
              handleReadClick(e, section.previewArticle, section.id)
            }
          >
            {currentReadClick.id === section.id ? "Close" : "Read"}
          </Button>
        </div>
      </div>

      {currentReadClick.id === section.id && (
        <div className="content-data" ref={iframeRef}>
          <IframeComponent
            previewArticle={currentReadClick.previewArticle}
            setCurrentReadClick={setCurrentReadClick}
          />
        </div>
      )}
    </div>
  );
};

export default Content;
