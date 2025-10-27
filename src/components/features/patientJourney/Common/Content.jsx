import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Form, Tab, Tabs } from "react-bootstrap";
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
import { countryRegionArray } from "../../../../constants/countryRegion";
import QRCode from "react-qr-code";
import Select from "react-select/base";

const Content = ({ section: initialSection, idx, favTab }) => {
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
  const [error, setError] = useState({
    name: { error: false, message: "" },
    email: { error: false, message: "" },
    country: { error: false, message: "" },
    consent: { error: false, message: "" },
    global: { error: false, message: "" },
  });
  const [country, setCountry] = useState("");
  const [readContent, setReadContent] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState({
    checkbox3: false,
    checkbox4: true,
    checkbox5: false,
    checkbox6: false,
  });
  const circumference = 2 * Math.PI * 45;

  const filterCountries = () => {
    const coutries = Object.entries(countryRegionArray).map(([country]) => ({
      value: country,
      label: country,
    }));
    setCountryList(coutries);
  };

  useEffect(() => {
    filterCountries();
  }, [country]);

  const handleStarClick = async () => {
    try {
      const response = await updateContentRating(
        section.id,
        setIsLoading,
        setToast
      );
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
      } else {
        setToast({
          show: true,
          type: "danger",
          title: "Removed",
          message: "Rating removed successfully",
        });
      }
    } catch (ex) {}
  };

  const getAgeGroup = () => {
    const tags =
      section.age_groups !== "" ? JSON.parse(section.age_groups) : [];
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
        saveAs(blob, section.title.replaceAll(" ", "_") + "." + extenstion);
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
        saveAs(blob, section.title.replaceAll(" ", "_") + "." + extenstion);
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
        saveAs(content, section.title.replaceAll(" ", "_") + ".zip");
      }
      setDownloading(false);

      await TrackDownloads(section.id, setIsLoading, setToast);
    } catch (ex) {
      toast.error("Failed to download the content.");
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
      let newError = {
        name: { error: false, message: "" },
        email: { error: false, message: "" },
        country: { error: false, message: "" },
        consent: { error: false, message: "" },
        global: { error: false, message: "" },
      };

      if (!email) {
        newError.email = { error: true, message: "Email is required!!" };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newError.email = {
          error: true,
          message: "Please enter correct email!!",
        };
      }

      if (!name) {
        newError.name = { error: true, message: "Name is required!!" };
      }

      if (!country) {
        newError.country = { error: true, message: "Country is required!!" };
      }

      if (
        !checkboxChecked.checkbox3 &&
        !checkboxChecked.checkbox4 &&
        !checkboxChecked.checkbox5 &&
        !checkboxChecked.checkbox6
      ) {
        newError.consent = { error: true, message: "Consent is required!!" };
      }

      setError(newError);

      if (
        newError.name.error ||
        newError.email.error ||
        newError.country.error ||
        newError.consent.error
      )
        return;

      let consentStr = "";

      if (checkboxChecked.checkbox5) {
        consentStr = consentStr + "checkbox3~checkbox4~checkbox5";
      } else if (checkboxChecked.checkbox3) {
        consentStr = consentStr + "checkbox3";
      } else if (checkboxChecked.checkbox4) {
        consentStr = consentStr + "checkbox4";
      } else if (checkboxChecked.checkbox6) {
        consentStr = consentStr + "checkbox6";
      }

      console.log(consentStr);
      // await SubmitShareContent(section.id, email, message, name, setIsLoading, setToast);
      // toast.success("Content shared via email successfully");
      // handleCloseModal();
    } catch (ex) {
      setError({
        name: { error: false, message: "" },
        email: { error: false, message: "" },
        country: { error: false, message: "" },
        consent: { error: false, message: "" },
        global: { error: true, message: "Oops!! Something went wrong." },
      });
    }
  };

  const handleCheckBoxClick = (name) => {
    if (name === "checkbox3")
      setCheckboxChecked({
        checkbox3: checkboxChecked.checkbox5
          ? true
          : !checkboxChecked.checkbox3,
        checkbox4: false,
        checkbox5: false,
        checkbox6: false,
      });
    else if (name === "checkbox4")
      setCheckboxChecked({
        checkbox3: false,
        checkbox4: checkboxChecked.checkbox5
          ? true
          : !checkboxChecked.checkbox4,
        checkbox5: false,
        checkbox6: false,
      });
    else if (name === "checkbox5")
      setCheckboxChecked({
        checkbox3: !checkboxChecked.checkbox5,
        checkbox4: !checkboxChecked.checkbox5,
        checkbox5: !checkboxChecked.checkbox5,
        checkbox6: false,
      });
    else if (name === "checkbox6")
      setCheckboxChecked({
        checkbox3: false,
        checkbox4: false,
        checkbox5: false,
        checkbox6: !checkboxChecked.checkbox6,
      });
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
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Share content with HCP</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Tabs
              defaultActiveKey="new-member"
              id="share_modal"
              className="mb-3"
            >
              <Tab eventKey="new-member" title="New Member">
                <div className="message-info">
                  <div className="warning-message">
                    <div className="info-icon">
                      <img src={path_image + "warning-icon.svg"} alt="" />
                    </div>
                    <div className="text-muted">
                      This screen is for the HCP. Please hand them your device
                      to review and give consent.
                    </div>
                  </div>
                  <div className="info-message">
                    By registering, you agree to receive the selected content by
                    email. Your data will be handled according to the
                    data-privacy policy of <span>Octapharma AG</span> and{" "}
                    <span>Docintel.app</span>.
                  </div>
                </div>
                <div className="share-form">
                  <Form className="registration-form">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Name <span>(Required)</span>
                      </Form.Label>
                      <div className="input-with-icon front">
                        <span>
                          <svg
                            width="22"
                            height="21"
                            viewBox="0 0 22 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 13.2565L11 14.7565"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 9.25647L2.15288 12.1197C2.31714 15.7335 2.39927 17.5403 3.55885 18.6484C4.71843 19.7565 6.52716 19.7565 10.1446 19.7565H11.8554C15.4728 19.7565 17.2816 19.7565 18.4412 18.6484C19.6007 17.5403 19.6829 15.7335 19.8471 12.1197L20 9.25647"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M1.84718 8.69953C3.54648 11.9309 7.3792 13.2565 11 13.2565C14.6208 13.2565 18.4535 11.9309 20.1528 8.69953C20.964 7.15703 20.3498 4.25647 18.352 4.25647H3.648C1.65023 4.25647 1.03603 7.15703 1.84718 8.69953Z"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M15 4.25647L14.9117 3.94741C14.4717 2.40736 14.2517 1.63734 13.7279 1.1969C13.2041 0.75647 12.5084 0.75647 11.117 0.75647H10.883C9.49159 0.75647 8.79587 0.75647 8.2721 1.1969C7.74832 1.63734 7.52832 2.40736 7.0883 3.94741L7 4.25647"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>{" "}
                      {error.name.error && (
                        <div className="">{error.name.message}</div>
                      )}
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>
                        Email <span>(Required)</span>
                      </Form.Label>
                      <div className="input-with-icon front">
                        <span className="icon">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {error.email.error && (
                        <div className="">{error.email.message}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>
                        Country <span>(Required)</span>
                      </Form.Label>
                      <div className="input-with-icon front">
                        <span className="icon">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <Form.Control
                          as="select"
                          onChange={(e) => setCountry(e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select your country
                          </option>
                          {countryList.map((cntry, idx) => (
                            <option key={idx} value={cntry.value}>
                              {cntry.label}
                            </option>
                          ))}
                        </Form.Control>
                      </div>
                      {error.country.error && (
                        <div className="">{error.country.message}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="form-group consent-group">
                      <Form.Label>
                        I also consent to: <span>(Required)</span>
                      </Form.Label>
                      <div className="radio-options">
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleCheckBoxClick("checkbox3")}
                          checked={checkboxChecked.checkbox3}
                          label="Receive One Source updates and new materials from Octapharma."
                          name="consent"
                        />
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleCheckBoxClick("checkbox4")}
                          checked={checkboxChecked.checkbox4}
                          label="Receive invitations to future events."
                          name="consent"
                        />
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleCheckBoxClick("checkbox5")}
                          checked={checkboxChecked.checkbox5}
                          label="Both of the options above."
                          name="consent"
                        />
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleCheckBoxClick("checkbox6")}
                          checked={checkboxChecked.checkbox6}
                          label="None of the options above."
                          name="consent"
                        />
                      </div>
                      {error.consent.error && (
                        <div className="">{error.consent.message}</div>
                      )}
                    </Form.Group>

                    <div className="note-box">
                      <i className="bi bi-info-circle"></i>
                      <p>
                        Your consent can be changed or withdrawn at any time in
                        your One Source (Docintel) account after registration.
                      </p>
                    </div>
                    {error.global.error && (
                      <div className="">{error.global.message}</div>
                    )}
                    <div className="form-buttons">
                      <button
                        className="btn cancel"
                        type="button"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn share"
                        type="button"
                        onClick={handleSubmitClick}
                      >
                        Share <i className="bi bi-send-fill"></i>
                      </button>
                    </div>
                  </Form>
                </div>
              </Tab>
              <Tab eventKey="existing-member" title="Existing Member">
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.002 12.4998C10.4621 12.4998 10.8352 12.873 10.8353 13.3332C10.8353 13.7934 10.4622 14.1665 10.002 14.1665H9.99463C9.5344 14.1665 9.1613 13.7934 9.1613 13.3332C9.16141 12.873 9.53446 12.4998 9.99463 12.4998H10.002Z"
                        fill="#F79548"
                      />
                      <path
                        d="M10.0011 6.87483C10.3463 6.87483 10.626 7.15475 10.6261 7.49983V10.8332C10.6261 11.1783 10.3463 11.4582 10.0011 11.4582C9.65597 11.4582 9.37614 11.1783 9.37614 10.8332V7.49983C9.37625 7.15475 9.65603 6.87483 10.0011 6.87483Z"
                        fill="#F79548"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.6364 1.6787C9.52319 1.38446 10.4791 1.38442 11.3659 1.6787C12.2492 1.97193 12.9429 2.66784 13.6397 3.64485C14.3386 4.62504 15.1118 5.99423 16.1104 7.76106C17.1089 9.52805 17.8833 10.8968 18.3646 12.005C18.8451 13.1115 19.0844 14.0674 18.8936 14.9852C18.7013 15.909 18.2272 16.7492 17.537 17.3843C16.8482 18.0178 15.9101 18.2853 14.7293 18.4137C13.5471 18.5423 11.9977 18.5415 10.0011 18.5415C8.00458 18.5415 6.45524 18.5423 5.27295 18.4137C4.09209 18.2853 3.1541 18.0178 2.46534 17.3843C1.77504 16.7492 1.30101 15.9091 1.10873 14.9852C0.917824 14.0674 1.15718 13.1115 1.6377 12.005C2.11904 10.8968 2.89337 9.528 3.89193 7.76106C4.89041 5.99428 5.66366 4.62502 6.36264 3.64485C7.05937 2.66788 7.7531 1.9719 8.6364 1.6787ZM10.972 2.86523C10.3409 2.65582 9.66139 2.65586 9.03028 2.86523C8.53366 3.03008 8.03373 3.45392 7.37989 4.37076C6.72831 5.28451 5.99259 6.58452 4.97999 8.3763C3.9674 10.168 3.23331 11.4694 2.78435 12.5031C2.33466 13.5385 2.22201 14.1983 2.33269 14.7305C2.47238 15.4017 2.81577 16.0085 3.31169 16.4647C3.7012 16.823 4.30818 17.0515 5.40805 17.1711C6.50672 17.2905 7.97505 17.2915 10.0011 17.2915C12.0272 17.2915 13.4956 17.2905 14.5942 17.1711C15.694 17.0515 16.3011 16.8229 16.6906 16.4647C17.1864 16.0085 17.5299 15.4016 17.6696 14.7305C17.7803 14.1983 17.6676 13.5385 17.2179 12.5031C16.769 11.4694 16.0349 10.1681 15.0223 8.3763C14.0097 6.58447 13.274 5.28453 12.6224 4.37076C11.9685 3.45388 11.4686 3.0301 10.972 2.86523Z"
                        fill="#F79548"
                      />
                    </svg>
                  </div>
                  <div>
                    This screen is for the HCP. Show them the QR code to open
                    the content on their own device.
                  </div>
                </div>
                <span style={{ textAlign: "center", display: "block" }}>
                  {" "}
                  Scan to open the content
                </span>
                <div
                  style={{
                    textAlign: "center",
                    display: "block",
                    color: "blue",
                  }}
                >
                  <QRCode
                    value={section.previewArticle}
                    size={160}
                    fgColor="#183B4D"
                  />
                </div>

                <span style={{ textAlign: "center", display: "block" }}>
                  Ask the HCP to scan this code. They&apos;ll authenticate with
                  their One Source account and the content will open on their
                  phone.
                </span>

                <Button type="button" onClick={handleCloseModal}>
                  Close
                </Button>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </div>
      <div className="content-box">
        <div className="format">
          <div className="d-flex align-items-center">
            <img
              src={
                path_image +
                "icons/" +
                (iconMapping.category[section.category]
                  ? iconMapping.category[section.category]
                  : "narrative_e_learning.svg")
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
                        fill="var(--gray)"
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
                        fill="var(--gray)"
                      />
                      <path
                        d="M9.00001 0.708008C9.34513 0.708069 9.62501 0.987868 9.62501 1.33301V8.38379C9.62648 8.38207 9.62842 8.38064 9.62989 8.37891C9.81909 8.15562 10.0046 7.91831 10.176 7.7002C10.336 7.49645 10.5041 7.28224 10.6349 7.14762C10.8755 6.90024 11.2712 6.89427 11.5187 7.1346C11.7661 7.3751 11.772 7.77087 11.5317 8.01839C11.4578 8.09443 11.3358 8.24634 11.1582 8.47249C10.9917 8.68443 10.791 8.94227 10.5837 9.18701C10.3787 9.42894 10.149 9.68007 9.9196 9.87549C9.8047 9.97336 9.6748 10.0702 9.53549 10.1449C9.40098 10.2168 9.2152 10.2913 9.00001 10.2913C8.78482 10.2913 8.59905 10.2168 8.46453 10.1449C8.32521 10.0703 8.19533 9.97336 8.08041 9.87549C7.85104 9.68008 7.62136 9.42895 7.41635 9.18701C7.20897 8.94227 7.00827 8.68443 6.8418 8.47249C6.66419 8.24636 6.54219 8.09446 6.46827 8.01839C6.22792 7.77086 6.23385 7.37511 6.48129 7.1346C6.72883 6.89431 7.12459 6.9002 7.36508 7.14762C7.49588 7.28225 7.66404 7.49647 7.82406 7.7002C7.99539 7.91831 8.18093 8.15563 8.37012 8.37891C8.3716 8.38063 8.37354 8.38206 8.37501 8.38379V1.33301C8.37501 0.98783 8.65483 0.708008 9.00001 0.708008Z"
                        fill="var(--gray)"
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
          {section.diagnosis !== "" &&
            JSON.parse(section.diagnosis).map((dgns, idx, arr) => {
              const imageName = filterCategory.data.filter(
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
                  {idx < arr.length - 1 ? (
                    <span className="pipe">|</span>
                  ) : null}
                </div>
              );
            })}
        </div>
        <div className="tags tag-list">
          {[
            ...JSON.parse(section.tags || "[]"),
            ...JSON.parse(section.functional_tags || "[]"),
          ].map((tag, idx) => (
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
