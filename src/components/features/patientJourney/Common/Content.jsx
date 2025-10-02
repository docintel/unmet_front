import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Form } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Modal from "react-bootstrap/Modal";
import {
  SubmitShareContent,
  TrackDownloads,
  updateContentRating,
} from "../../../../services/touchPointServices";
import IframeComponent from "./IframeComponent";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Content = ({
  section: initialSection,
  idx,
  currentReadClick,
  setCurrentReadClick,
}) => {
  const staticUrl = import.meta.env.VITE_AWS_DOWNLOAD_URL;
  const [section, setSection] = useState(initialSection);
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { updateRating, setIsLoading } = useContext(ContentContext);
  const iframeRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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

  const handleShareClick = () => {
    setShowModal(true);
  };

  const handleDownloadClick = async () => {
    try {
      if (
        section.file_type.toLowerCase() === "pdf" ||
        section.file_type.toLowerCase() === "video"
      ) {
        const downloadUrl = `${staticUrl}/${section.file_type}/${section.folder_name}/${section.pdf_files}`;
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const extenstion = downloadUrl.split("/").pop().split(".").pop();
        saveAs(blob, section.title + "." + extenstion);
      } else if (section.file_type.toLowerCase() === "iframe") {
        const downloadUrl = section.pdf_files.split("=")[1];
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const extenstion = downloadUrl.split("/").pop().split(".").pop();
        saveAs(blob, section.title + "." + extenstion);
      } else {
        const zip = new JSZip();
        const fileLinks = section.pdf_files.split(",");
        for (let i = 0; i < fileLinks.length; i++) {
          const url = `${staticUrl}/${
            fileLinks[i].split(".").pop() !== "pdf" ? "video" : "ebook"
          }/${section.folder_name}/${fileLinks[i]}`;
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = url.split("/").pop() || `file${i + 1}`;
            zip.file(fileName, blob);
          } catch (err) {
            console.error(`Failed to fetch ${url}`, err);
          }
        }
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, section.title + ".zip");
      }
      await TrackDownloads(section.id);
    } catch (ex) {
      toast("Failed to download the content.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail("");
    setName("");
    setMessage("");
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required!!");
      return;
    }
    await SubmitShareContent(section.id, email, message || null, name || null);
    toast.success("Content shared via email successfully");
    handleCloseModal();
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

      <div className="pop_up">
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Contact Form</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleSubmitClick}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>
                  Email
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      marginLeft: "1px",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSubmitClick}>
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
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
              <Dropdown.Item onClick={handleShareClick}>Share</Dropdown.Item>
              <Dropdown.Item onClick={handleDownloadClick}>
                Download
              </Dropdown.Item>
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
