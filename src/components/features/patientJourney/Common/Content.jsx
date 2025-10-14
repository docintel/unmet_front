import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Form } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Modal from "react-bootstrap/Modal";
import
  {
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
  favTab,
  // currentReadClick,
  // setCurrentReadClick,
}) => {
  const staticUrl = import.meta.env.VITE_AWS_DOWNLOAD_URL;
  const [section, setSection] = useState(initialSection);
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { filterCategory, updateRating, setIsLoading, setToast } =
    useContext(ContentContext);
  const iframeRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState({});
  const [readContent, setReadContent] = useState(false);
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
        setToast({
          show: true,
          type: "info",
          title: "Success",
          message: "Rating saved successfully",
        });
        setIsLoading(false);
      } else {
        setToast({
          show: true,
          type: "danger",
          title: "Removed",
          message: "Rating removed successfully",
        });
        setIsLoading(false);
      }
    } catch (ex) {
      toast.error("Oops!! somthing went wrong.");
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (currentReadClick.id === section.id && iframeRef.current) {
  //     iframeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // }, [currentReadClick, section.id]);

  const getAgeGroup = () =>
  {
    const tags = JSON.parse(section.age_groups);
    return tags
      .map((tag) =>
      {
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

  const handleReadClick = (e, link, id) =>
  {
    e.preventDefault();
    // If clicking same article, toggle off
    if (currentReadClick.id === id) {
      setCurrentReadClick({ previewArticle: null, id: null });
    } else {
      setCurrentReadClick({ previewArticle: link, id });
    }
  };

  const handleShareClick = () =>
  {
    setShowModal(true);
  };

  const handleDownloadClick = async () =>
  {
    let received = 0;
    let total = 0;

    const getContentSize = async (fileUrl) =>
    {
      const response = await fetch(fileUrl, { method: "HEAD" });
      if (!response.ok) throw new Error("Request failed");
      total += parseInt(response.headers.get("Content-Length"));
    };

    const downloadFileChuck = async (fileUrl) =>
    {
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
          const url = `${staticUrl}/${fileLinks[i].split(".").pop() !== "pdf" ? "video" : "ebook"
            }/${section.folder_name}/${fileLinks[i]}`;
          try {
            await getContentSize(url);
          } catch (err) {
            console.error(`Failed to fetch ${url}`, err);
          }
        }

        for (let i = 0; i < fileLinks.length; i++) {
          const url = `${staticUrl}/${fileLinks[i].split(".").pop() !== "pdf" ? "video" : "ebook"
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

  const handleCloseModal = () =>
  {
    setShowModal(false);
    setEmail("");
    setName("");
    setMessage("");
  };

  const handleSubmitClick = async (e) =>
  {
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

  // Add state for hover
  const [isStarHovered, setIsStarHovered] = useState(false);

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
          className="share-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Share</Modal.Title>
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
                      color: "var(--pink)",
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
                <p style={{ color: "var(--pink)" }}>
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
              <p style={{ color: "var(--pink)" }}>
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
                    <svg
                      width="18"
                      height="16"
                      viewBox="0 0 18 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14 0.291992C15.7259 0.291992 17.125 1.6911 17.125 3.41699C17.125 5.14288 15.7259 6.54199 14 6.54199C12.9586 6.54199 12.0369 6.03207 11.4691 5.24886L7.04281 7.29232C7.09555 7.51992 7.125 7.75668 7.125 8.00033C7.125 8.24424 7.09567 8.48131 7.04281 8.70915L11.4683 10.751C12.0361 9.96785 12.9587 9.45866 14 9.45866C15.7259 9.45866 17.125 10.8578 17.125 12.5837C17.125 14.3095 15.7259 15.7087 14 15.7087C12.2741 15.7087 10.875 14.3095 10.875 12.5837C10.875 12.3454 10.9018 12.1133 10.9523 11.8903L6.52116 9.84522C5.95253 10.621 5.03554 11.1253 4 11.1253C2.27411 11.1253 0.875 9.72622 0.875 8.00033C0.875 6.27444 2.27411 4.87533 4 4.87533C5.03572 4.87533 5.95337 5.37947 6.52197 6.15544L10.9531 4.11117C10.9025 3.88786 10.875 3.65563 10.875 3.41699C10.875 1.6911 12.2741 0.291992 14 0.291992ZM14 10.7087C12.9645 10.7087 12.125 11.5481 12.125 12.5837C12.125 13.6192 12.9645 14.4587 14 14.4587C15.0355 14.4587 15.875 13.6192 15.875 12.5837C15.875 11.5481 15.0355 10.7087 14 10.7087ZM4 6.12533C2.96447 6.12533 2.125 6.96479 2.125 8.00033C2.125 9.03586 2.96447 9.87533 4 9.87533C5.03553 9.87533 5.875 9.03586 5.875 8.00033C5.875 6.96479 5.03553 6.12533 4 6.12533ZM14 1.54199C12.9645 1.54199 12.125 2.38146 12.125 3.41699C12.125 4.45253 12.9645 5.29199 14 5.29199C15.0355 5.29199 15.875 4.45253 15.875 3.41699C15.875 2.38146 15.0355 1.54199 14 1.54199Z"
                        fill="#94A7BF"
                      />
                    </svg>
                    Share
                  </Dropdown.Item>
                )}{" "}
                {section.download == 1 && (
                  <Dropdown.Item onClick={handleDownloadClick}>
                    <svg
                      width="18"
                      height="16"
                      viewBox="0 0 18 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.9108 9.45801C16.0258 9.13274 16.383 8.96232 16.7083 9.07715C17.0336 9.19216 17.204 9.54929 17.0892 9.87467L16.8947 10.4264C16.5203 11.4874 16.2226 12.3323 15.9059 12.985C15.5823 13.6521 15.2131 14.1756 14.6633 14.5646C14.1135 14.9536 13.4973 15.1276 12.7606 15.2108C12.0397 15.2922 11.144 15.2913 10.0189 15.2913H7.98113C6.85606 15.2913 5.96035 15.2922 5.23943 15.2108C4.50268 15.1276 3.88655 14.9536 3.33676 14.5646C2.78695 14.1756 2.41773 13.6521 2.09408 12.985C1.77742 12.3323 1.47976 11.4874 1.10531 10.4264L0.910814 9.87467C0.795983 9.5493 0.966405 9.19216 1.29167 9.07715C1.61705 8.96231 1.97418 9.13274 2.0892 9.45801L2.28451 10.0106C2.66843 11.0984 2.93994 11.8651 3.21876 12.4398C3.49062 13.0001 3.74318 13.3209 4.0586 13.5441C4.37403 13.7673 4.76058 13.899 5.3794 13.9689C6.0141 14.0406 6.82767 14.0413 7.98113 14.0413H10.0189C11.1723 14.0413 11.9859 14.0406 12.6206 13.9689C13.2394 13.899 13.626 13.7673 13.9414 13.5441C14.2568 13.3209 14.5094 13.0001 14.7813 12.4398C15.0601 11.8651 15.3316 11.0984 15.7155 10.0106L15.9108 9.45801Z"
                        fill="#94A7BF"
                      />
                      <path
                        d="M9.00001 0.708008C9.34513 0.708069 9.62501 0.987868 9.62501 1.33301V8.38379C9.62648 8.38207 9.62842 8.38064 9.62989 8.37891C9.81909 8.15562 10.0046 7.91831 10.176 7.7002C10.336 7.49645 10.5041 7.28224 10.6349 7.14762C10.8755 6.90024 11.2712 6.89427 11.5187 7.1346C11.7661 7.3751 11.772 7.77087 11.5317 8.01839C11.4578 8.09443 11.3358 8.24634 11.1582 8.47249C10.9917 8.68443 10.791 8.94227 10.5837 9.18701C10.3787 9.42894 10.149 9.68007 9.9196 9.87549C9.8047 9.97336 9.6748 10.0702 9.53549 10.1449C9.40098 10.2168 9.2152 10.2913 9.00001 10.2913C8.78482 10.2913 8.59905 10.2168 8.46453 10.1449C8.32521 10.0703 8.19533 9.97336 8.08041 9.87549C7.85104 9.68008 7.62136 9.42895 7.41635 9.18701C7.20897 8.94227 7.00827 8.68443 6.8418 8.47249C6.66419 8.24636 6.54219 8.09446 6.46827 8.01839C6.22792 7.77086 6.23385 7.37511 6.48129 7.1346C6.72883 6.89431 7.12459 6.9002 7.36508 7.14762C7.49588 7.28225 7.66404 7.49647 7.82406 7.7002C7.99539 7.91831 8.18093 8.15563 8.37012 8.37891C8.3716 8.38063 8.37354 8.38206 8.37501 8.38379V1.33301C8.37501 0.98783 8.65483 0.708008 9.00001 0.708008Z"
                        fill="#94A7BF"
                      />
                    </svg>
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
          {JSON.parse(section.diagnosis).map((dgns, idx, arr) =>
          {
            const imageName = filterCategory.filter(
              (item) => item.name === dgns
            )[0];
            return (
              <div key={idx}>
                <span key={idx}>{dgns}</span>
                <img
                  src={
                    path_image + "icons/" + (imageName ? imageName.image : "")
                  }
                  alt=""
                />{" "}
                {idx < arr.length - 1 ? <span className="pipe">|</span> : null}
              </div>
            );
          })}
        </div>
        <div className="tags tag-list">
          {JSON.parse(section.tags).map((tag, idx) => (
            <div key={idx}>{tag}</div>
          ))}
        </div>
        <div className="date">{section.creation_date}</div>
        <div className="favorite d-flex justify-content-between align-sections-center">
          <div className="d-flex align-sections-center">
            {favTab ? null : (
              <img
                src={
                  isStarHovered
                    ? path_image + "star-hover.svg"
                    : path_image +
                    (section.self_rate ? "star-filled.svg" : "star-img.svg")
                }
                alt=""
                style={{ cursor: "pointer" }}
                onClick={handleStarClick}
                onMouseEnter={() => setIsStarHovered(true)}
                onMouseLeave={() => setIsStarHovered(false)}
              />
            )}
            {favTab ? null : section.rating}
          </div>
          <Button
            variant="primary"
            onClick={(e) => setReadContent(!readContent)}
          >
            {readContent ? "Close" : "View"}
          </Button>
        </div>
      </div>
      <div className="pop_up">
        <Modal
          show={readContent}
          onHide={() => setReadContent(!readContent)}
          backdrop="static"
          keyboard={false}
          centered
          fullscreen
          dialogClassName="iframe-custom-modal"
        >
          <Modal.Header className="custom-modal-header">
            <button className="back-btn" onClick={() => setReadContent(false)}>
              <img src={path_image + "left-white-arrow.svg"} alt="" />
              <span>Back</span>
            </button>
            <div className="modal-logo">
              <img src={path_image + "vwd-journey-logo.svg"} alt="" />
            </div>
          </Modal.Header>

          <Modal.Body className="custom-modal-body">
            <div className="content-data" ref={iframeRef}>
              <IframeComponent previewArticle={section.previewArticle} />
            </div>
          </Modal.Body>
        </Modal>
      </div>
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
