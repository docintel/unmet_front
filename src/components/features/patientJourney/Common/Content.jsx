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
import { iconMapping } from "../../../../constants/iconMapping";

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
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState({});
  const circumference = 2 * Math.PI * 45;

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
        toast.success("Rating saved successfully");
        setIsLoading(false);
      } else {
        toast.warn("Rating removed successfully");
        setIsLoading(false);
      }
    } catch (ex) {
      toast.error("Oops!! somthing went wrong.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentReadClick.id === section.id && iframeRef.current) {
      iframeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentReadClick, section.id]);

  const getAgeGroup = () => {
    const tags = JSON.parse(section.age_groups);
    return tags
      .map((tag) => {
        if (tag === "Age <6")
          return {
            tagLabel: tag,
            tagClass: "age0",
          };
        else
          return {
            tagLabel: tag,
            tagClass: tag
              .replace(/[\s><+]/g, "")
              .split("-")[0]
              .slice(0, 6)
              .replace(/[\s-><]/g, "")
              .toLowerCase(),
          };
      })
      .sort(
        (a, b) =>
          parseInt(a.tagClass.split("ge")[1]) -
          parseInt(b.tagClass.split("ge")[1])
      );
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
    let received = 0;
    let total = 0;

    const getContentSize = async (fileUrl) => {
      const response = await fetch(fileUrl, { method: "HEAD" });
      if (!response.ok) throw new Error("Request failed");
      total += parseInt(response.headers.get("Content-Length"));
    };

    const downloadFileChuck = async (fileUrl) => {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Download failed");
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) {
          setProgress(Math.floor((received / total) * 100));
        }
      }
      return new Blob(chunks);
    };

    try {
      setDownloading(true);
      if (
        section.file_type.toLowerCase() === "pdf" ||
        section.file_type.toLowerCase() === "video"
      ) {
        const downloadUrl = `${staticUrl}/${section.file_type}/${section.folder_name}/${section.pdf_files}`;
        // const link = document.createElement("a");
        // link.href = downloadUrl;
        // const extenstion = downloadUrl.split("/").pop().split(".").pop();
        // link.download = `${section.title}.${extenstion}`;
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        await getContentSize(downloadUrl);
        const blob = await downloadFileChuck(downloadUrl);
        const extenstion = downloadUrl.split("/").pop().split(".").pop();
        saveAs(blob, section.title + "." + extenstion);
        setDownloading(false);
      } else if (section.file_type.toLowerCase() === "iframe") {
        const downloadUrl = section.pdf_files.split("=")[1];
        // const link = document.createElement("a");
        // link.href = downloadUrl;
        // const extenstion = downloadUrl.split("/").pop().split(".").pop();
        // link.download = section.title + "." + extenstion;
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        await getContentSize(downloadUrl);
        const blob = await downloadFileChuck(downloadUrl);

        const extenstion = downloadUrl.split("/").pop().split(".").pop();
        saveAs(blob, section.title + "." + extenstion);
        setDownloading(false);
      } else {
        setDownloading(true);
        const zip = new JSZip();
        const fileLinks = section.pdf_files.split(",");
        // for (let i = 0; i < fileLinks.length; i++) {
        //   const file = fileLinks[i];
        //   try {
        //     const url = `${staticUrl}/${
        //       fileLinks[i].split(".").pop() !== "pdf" ? "video" : "ebook"
        //     }/${section.folder_name}/${fileLinks[i]}`;
        //     const response = await fetch(url);
        //     if (!response.ok) throw new Error("Failed to fetch " + file.url);

        //     const blob = await response.blob();
        //     zip.file(file.name, blob);
        //   } catch (err) {
        //     console.error(`Error fetching ${file.name}:`, err);
        //   }
        // }

        // const content = await zip.generateAsync({ type: "blob" });
        // const url = URL.createObjectURL(content);

        // // Create a temporary <a> tag and click it to trigger browser download
        // const link = document.createElement("a");
        // link.href = url;
        // link.download = section.title + ".zip";
        // document.body.appendChild(link);
        // link.click();
        // link.remove();

        // Release the object URL
        // URL.revokeObjectURL(url);
        for (let i = 0; i < fileLinks.length; i++) {
          const url = `${staticUrl}/${
            fileLinks[i].split(".").pop() !== "pdf" ? "video" : "ebook"
          }/${section.folder_name}/${fileLinks[i]}`;
          try {
            await getContentSize(url);
          } catch (err) {
            console.error(`Failed to fetch ${url}`, err);
          }
        }

        for (let i = 0; i < fileLinks.length; i++) {
          const url = `${staticUrl}/${
            fileLinks[i].split(".").pop() !== "pdf" ? "video" : "ebook"
          }/${section.folder_name}/${fileLinks[i]}`;
          try {
            const blob = await downloadFileChuck(url);

            const fileName = url.split("/").pop() || `file${i + 1}`;
            zip.file(fileName, blob);
          } catch (err) {
            console.error(`Failed to fetch ${url}`, err);
          }
        }
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, section.title + ".zip");
      }
      setDownloading(false);

      await TrackDownloads(section.id);
    } catch (ex) {
      toast.error("Failed to download the content.");
      setDownloading(false);
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
    try {
      if (!email) {
        setError({ type: "email", message: "Email is required!!" });
        return;
      }
      setIsLoading(true);

      await SubmitShareContent(
        section.id,
        email,
        message || null,
        name || null
      );
      toast.success("Content shared via email successfully");
      handleCloseModal();
      setIsLoading(false);
    } catch (ex) {
      setError({ type: "global", message: "Oops!! somthing went wrong." });
      setIsLoading(false);
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
                <p style={{ color: "red" }}>
                  {error && error.type === "email" && error.message}
                </p>
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
              <p style={{ color: "red" }}>
                {error && error.type === "global" && error.message}
              </p>
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
            <img
              src={
                path_image + "icons/" + iconMapping.category[section.category]
              }
              alt=""
            />
            <p>{section.category}</p>
          </div>

          {(section.share == 1 || section.download == 1) && (
            <Dropdown align="end">
              <Dropdown.Toggle>
                <img src={path_image + "options.svg"} alt="dropdown" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {section.share == 1 && (
                  <Dropdown.Item onClick={handleShareClick}>
                    Share
                  </Dropdown.Item>
                )}{" "}
                {section.download == 1 && (
                  <Dropdown.Item onClick={handleDownloadClick}>
                    Download
                  </Dropdown.Item>
                )}{" "}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div className="heading">{section.title}</div>
        <div className="subheading">{section.pdf_sub_title}</div>
        <div className="category">
          {JSON.parse(section.diagnosis).map((dgns, idx, arr) => (
            <>
              <div>
                <span key={idx}>{dgns}</span>
                <img src={path_image + "/icons/hmb.svg"} alt="" />
              </div>
              {arr.length - 1 !== idx ? <span className="pipe">|</span> : null}
            </>
          ))}
        </div>
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
      )}{" "}
      {/* Transparent overlay with circular progress */}
      {downloading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg
              width="120"
              height="120"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke="#e0e0e0"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke="#007bff"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference - (progress / 100) * circumference
                }
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                fontSize: "18px",
                color: "#007bff",
              }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
