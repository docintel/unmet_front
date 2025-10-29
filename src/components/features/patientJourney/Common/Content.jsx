import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Form, Tab, Tabs } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import {
  GenerateQrcodeUrl,
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
// import Select from "react-select/base";

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
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState({
    existingMember: false,
    newMember: false,
    open: false,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState({
    loading: false,
    error: false,
    data: "",
  });
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    setQrCodeUrl({
      loading: false,
      error: false,
      data: "",
    });
  }, [showModal]);

  const filterCountries = () => {
    const coutries = Object.entries(countryRegionArray).map(([country]) => ({
      value: country,
      label: country,
    }));
    setCountryList(coutries);
  };

  const handleTabSelect = async (key) => {
    if (key === "existing-member") {
      try {
        if (!qrCodeUrl.data) await GenerateQrcodeUrl(section.id, setQrCodeUrl);
      } catch (ex) {}
    }
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
          type: "success",
          title: "Added to Your Likes",
          message: "This content is now part of your favorites list.",
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
    setCountry("");
    setCheckboxChecked({
      checkbox3: false,
      checkbox4: true,
      checkbox5: false,
      checkbox6: false,
    });
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
      if (checkboxChecked.checkbox5)
        consentStr = "checkbox3~checkbox4~checkbox5";
      else if (checkboxChecked.checkbox3) consentStr = "checkbox3";
      else if (checkboxChecked.checkbox4) consentStr = "checkbox4";
      else if (checkboxChecked.checkbox6) consentStr = "checkbox6";

      await SubmitShareContent(
        section.id,
        email,
        name,
        country,
        consentStr,
        setIsLoading,
        setToast
      );
      toast.success("Content shared via email successfully");
      handleCloseModal();
      setShowConfirmationModal({
        existingMember: false,
        newMember: true,
        open: true,
      });
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

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal({
      existingMember: false,
      newMember: false,
      open: false,
    });
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
              onSelect={handleTabSelect}
            >
              <Tab eventKey="new-member" title="New Member">
                <div className="message-info">
                  <div className="warning-message">
                    <div className="info-icon">
                      <img src={path_image + "warning-icon.svg"} alt="" />
                    </div>
                    <div className="text-message">
                      This screen is for the HCP. Please hand them your device
                      to review and give consent.
                    </div>
                  </div>
                  <div className="info-message">
                    By registering, you agree to receive the selected content by
                    email. Your data will be handled according to the
                    data-privacy policy of{" "}
                    <a
                      href="https://onesource.octapharma.com/octapharma-privacy"
                      target="_blank"
                    >
                      Octapharma AG
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://onesource.octapharma.com/docintel-privacy"
                      target="_blank"
                    >
                      Docintel.app
                    </a>
                    .
                  </div>
                </div>
                <div className="share-form">
                  <Form className="registration-form">
                    <Form.Group className="form-group">
                      <Form.Label>
                        HCP Name{" "}
                        <span style={{ fontWeight: "lighter" }}>
                          (Required)
                        </span>
                      </Form.Label>
                      <div
                        className={
                          "input-with-icon" + (error.name.error ? " error" : "")
                        }
                      >
                        <span className="icon">
                          <svg
                            width="22"
                            height="20"
                            viewBox="0 0 22 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.93007 13.0464C2.67249 13.7835 -0.624787 15.2886 1.38348 17.172C2.3645 18.092 3.4571 18.75 4.83077 18.75H12.6692C14.0429 18.75 15.1355 18.092 16.1165 17.172C18.1248 15.2886 14.8275 13.7835 13.5699 13.0464C10.6209 11.3179 6.87906 11.3179 3.93007 13.0464Z"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.75 4.75C12.75 6.95914 10.9591 8.75 8.75 8.75C6.54086 8.75 4.75 6.95914 4.75 4.75C4.75 2.54086 6.54086 0.75 8.75 0.75C10.9591 0.75 12.75 2.54086 12.75 4.75Z"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M18.3721 2.31564C18.5957 2.07342 18.7074 1.95232 18.8262 1.88168C19.1128 1.71123 19.4657 1.70593 19.7571 1.8677C19.8779 1.93474 19.9931 2.05244 20.2235 2.28783C20.4539 2.52322 20.5692 2.64092 20.6348 2.76428C20.7931 3.06194 20.788 3.42244 20.6211 3.71521C20.5519 3.83655 20.4334 3.95073 20.1963 4.1791L17.3752 6.89629C16.9259 7.32906 16.7012 7.54545 16.4204 7.65512C16.1396 7.76479 15.831 7.75672 15.2136 7.74057L15.1296 7.73838C14.9417 7.73346 14.8477 7.73101 14.7931 7.66901C14.7385 7.60702 14.7459 7.5113 14.7608 7.31985L14.7689 7.2159C14.8109 6.67706 14.8319 6.40765 14.9371 6.16547C15.0423 5.92328 15.2238 5.72664 15.5868 5.33335L18.3721 2.31564Z"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
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
                        <div className="validation">{error.name.message}</div>
                      )}
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>
                        HCP Email{" "}
                        <span style={{ fontWeight: "lighter" }}>
                          (Required)
                        </span>
                      </Form.Label>
                      <div
                        className={
                          "input-with-icon" +
                          (error.email.error ? " error" : "")
                        }
                      >
                        <span className="icon">
                          <svg
                            width="22"
                            height="19"
                            viewBox="0 0 22 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.83038 0.0367951C9.78323 -0.0122598 11.7174 -0.0122703 13.6702 0.0367951C15.2216 0.0757754 16.4676 0.104667 17.4632 0.278006C18.4925 0.457314 19.3296 0.801922 20.0364 1.5114C20.7402 2.2179 21.0822 3.04271 21.2581 4.05535C21.4277 5.03232 21.4525 6.24871 21.4847 7.75847C21.5059 8.75443 21.5059 9.74495 21.4847 10.7409C21.4525 12.2506 21.4277 13.467 21.2581 14.444C21.0823 15.4566 20.74 16.2815 20.0364 16.988C19.3297 17.6974 18.4925 18.0421 17.4632 18.2214C16.4676 18.3947 15.2216 18.4236 13.6702 18.4626C11.7174 18.5116 9.78324 18.5116 7.83038 18.4626C6.27894 18.4236 5.03308 18.3947 4.03741 18.2214C3.00791 18.0421 2.17103 17.6975 1.46417 16.988C0.760314 16.2814 0.418361 15.4568 0.242486 14.444C0.072883 13.467 0.0481204 12.2507 0.0159232 10.7409C-0.00530575 9.74494 -0.00530975 8.75443 0.0159232 7.75847C0.0481185 6.24872 0.0728526 5.03231 0.242486 4.05535C0.418381 3.04276 0.760406 2.21787 1.46417 1.5114C2.17095 0.802098 3.00809 0.457266 4.03741 0.278006C5.03306 0.10472 6.279 0.0757713 7.83038 0.0367951ZM14.2054 7.81902C12.9121 8.55179 11.8608 8.99969 10.7483 8.99969C9.63597 8.99961 8.58448 8.55174 7.29131 7.81902L1.67022 4.63445C1.56681 5.42602 1.54499 6.42655 1.51592 7.78972C1.49513 8.76464 1.49514 9.73473 1.51592 10.7096C1.54908 12.2646 1.57435 13.3478 1.72002 14.1872C1.8596 14.9909 2.09952 15.5005 2.52667 15.9294C2.9509 16.3552 3.46683 16.5987 4.29424 16.7428C5.15535 16.8928 6.27126 16.9234 7.86749 16.9636C9.79529 17.012 11.7053 17.012 13.6331 16.9636C15.2293 16.9234 16.3453 16.8928 17.2064 16.7428C18.0335 16.5987 18.5498 16.3551 18.9739 15.9294C19.4008 15.5006 19.641 14.9907 19.7806 14.1872C19.9262 13.3478 19.9515 12.2645 19.9847 10.7096C20.0055 9.73475 20.0055 8.76463 19.9847 7.78972C19.9556 6.42535 19.9321 5.4244 19.8284 4.6325L14.2054 7.81902ZM13.6331 1.53582C11.7053 1.48738 9.79528 1.48739 7.86749 1.53582C6.27133 1.57592 5.15534 1.60661 4.29424 1.75652C3.46706 1.9006 2.95083 2.14438 2.52667 2.57C2.35282 2.74453 2.21075 2.93342 2.09307 3.1491L8.03155 6.51433C9.28641 7.22531 10.0483 7.49961 10.7483 7.49969C11.4485 7.49969 12.2101 7.22539 13.4651 6.51433L19.4046 3.14812C19.2871 2.93315 19.1473 2.74408 18.9739 2.57C18.5497 2.1442 18.0336 1.90065 17.2064 1.75652C16.3453 1.60656 15.2293 1.57593 13.6331 1.53582Z"
                              fill="#B5C2D3"
                            />
                          </svg>
                        </span>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {error.email.error && (
                        <div className="validation">{error.email.message}</div>
                      )}
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>
                        HCP Country{" "}
                        <span style={{ fontWeight: "lighter" }}>
                          (Required)
                        </span>
                      </Form.Label>
                      <div
                        onMouseEnter={(e) =>
                          e.currentTarget
                            .querySelector(".split-button")
                            .classList.add("active")
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget
                            .querySelector(".split-button")
                            .classList.remove("active")
                        }
                      >
                        <Select
                          className={`split-button ${
                            error.country.error ? "error" : ""
                          }`}
                          value={country}
                          onChange={(selectedOption) =>
                            setCountry(selectedOption)
                          }
                          placeholder="Select your country"
                          options={countryList}
                          isClearable
                        />
                        <span>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.08082 1.25647C4.47023 2.19237 1 6.26865 1 11.1554C1 16.7341 5.52238 21.2565 11.101 21.2565C15.9878 21.2565 20.0641 17.7862 21 13.1756"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M17.9375 17.2565C18.3216 17.1731 18.6771 17.0405 19 16.8595M13.6875 16.5971C14.2831 16.858 14.8576 17.0513 15.4051 17.1783M9.85461 14.2042C10.2681 14.4945 10.71 14.8426 11.1403 15.1429M2 13.0814C2.32234 12.924 2.67031 12.7433 3.0625 12.5886M5.45105 12.2565C6.01293 12.3189 6.64301 12.4791 7.35743 12.7797"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17 6.75647C17 5.92804 16.3284 5.25647 15.5 5.25647C14.6716 5.25647 14 5.92804 14 6.75647C14 7.5849 14.6716 8.25647 15.5 8.25647C16.3284 8.25647 17 7.5849 17 6.75647Z"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M16.488 12.8766C16.223 13.1203 15.8687 13.2565 15.5001 13.2565C15.1315 13.2565 14.7773 13.1203 14.5123 12.8766C12.0855 10.6321 8.83336 8.12462 10.4193 4.48427C11.2769 2.51596 13.3353 1.25647 15.5001 1.25647C17.6649 1.25647 19.7234 2.51596 20.5809 4.48427C22.1649 8.12003 18.9207 10.6398 16.488 12.8766Z"
                              stroke="#B5C2D3"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </span>
                        {error.country && error.region && (
                          <div className="validation">{error.region}</div>
                        )}
                      </div>

                      {error.country.error && (
                        <div className="validation">
                          {error.country.message}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="form-group consent-group">
                      <Form.Label className="checkbox-label">
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
                        <div className="validation">
                          {error.consent.message}
                        </div>
                      )}
                    </Form.Group>

                    <div className="message">
                      <div className="info-icon">
                        <img src={path_image + "info-icon.svg"} alt="" />
                      </div>
                      <Form.Text className="text-message">
                        Your consent can be changed or withdrawn at any time in
                        your One Source (Docintel) account after registration.
                      </Form.Text>
                    </div>

                    <div className="form-buttons">
                      <button
                        className="btn cancel"
                        type="button"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <Button
                        className="btn share"
                        type="button"
                        onClick={handleSubmitClick}
                      >
                        Share
                        <img src={path_image + "send-icon.svg"} alt="" />
                      </Button>
                    </div>
                  </Form>
                </div>
              </Tab>
              <Tab eventKey="existing-member" title="Existing Member">
                <div className="existing-member">
                  <div className="warning-message">
                    <div className="info-icon">
                      <img src={path_image + "warning-icon.svg"} alt="" />
                    </div>
                    <div className="text-message">
                      This screen is for the HCP. Please hand them your device
                      to review and give consent.
                    </div>
                  </div>
                  <div className="qr-section">
                    <span>Scan to open the content</span>
                    {qrCodeUrl.loading ? (
                      <>Loading...</>
                    ) : qrCodeUrl.error ? (
                      <>Failed to generate the QR code</>
                    ) : (
                      <div className="qr-box">
                        <QRCode
                          value={qrCodeUrl.data}
                          size={192}
                          fgColor="#183B4D"
                        />
                      </div>
                    )}
                  </div>

                  <div className="info-message">
                    Ask the HCP to scan this code. They&apos;ll authenticate
                    with their One Source account and the content will open on
                    their phone.
                  </div>

                  <Button
                    className="btn done"
                    type="button"
                    onClick={() => {
                      setShowConfirmationModal({
                        existingMember: true,
                        newMember: false,
                        open: true,
                      });
                      handleCloseModal();
                    }}
                  >
                    Done
                    <img src={path_image + "correct.svg"} alt="" />
                  </Button>
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </div>

      <div className="pop_up">
        <Modal
          show={showConfirmationModal.open}
          onHide={handleCloseConfirmationModal}
          backdrop="static"
          keyboard={false}
          centered
          className="confirmation"
          size="lg"
        >
          <Modal.Body>
            <div className="confirmation-card">
              <div className="check-icon">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.9167 0C27.8118 0 35.8333 8.02156 35.8333 17.9167C35.8333 27.8118 27.8118 35.8333 17.9167 35.8333C8.02156 35.8333 0 27.8118 0 17.9167C0 8.02156 8.02156 0 17.9167 0ZM17.9167 2.5C9.40228 2.5 2.5 9.40228 2.5 17.9167C2.5 26.4311 9.40228 33.3333 17.9167 33.3333C26.4311 33.3333 33.3333 26.4311 33.3333 17.9167C33.3333 9.40228 26.4311 2.5 17.9167 2.5Z"
                    fill="#3CAC8E"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.9167 2.5C9.40228 2.5 2.5 9.40228 2.5 17.9167C2.5 26.4311 9.40228 33.3333 17.9167 33.3333C26.4311 33.3333 33.3333 26.4311 33.3333 17.9167C33.3333 9.40228 26.4311 2.5 17.9167 2.5ZM25.6803 10.651C25.3493 10.0457 24.5899 9.82257 23.9844 10.153C21.032 11.7676 18.5576 14.9095 16.8701 17.4935C16.111 18.6559 15.4879 19.7439 15.0277 20.5957C14.5161 20.054 13.9882 19.5912 13.5254 19.2253C13.0745 18.8688 12.6684 18.5871 12.373 18.3936C12.2252 18.2967 12.1029 18.2215 12.0166 18.1689C11.9736 18.1428 11.9389 18.1217 11.9141 18.1071C11.902 18.1 11.8922 18.0935 11.8848 18.0892L11.8685 18.0811C11.2689 17.7395 10.5063 17.9488 10.1644 18.5482C9.82281 19.1477 10.0322 19.9103 10.6315 20.2523C10.6315 20.2523 10.639 20.2579 10.6462 20.262C10.661 20.2708 10.6857 20.2848 10.7178 20.3044C10.7825 20.3437 10.8802 20.4048 11.0026 20.485C11.2488 20.6463 11.5925 20.8847 11.9743 21.1865C12.7545 21.8034 13.6231 22.6301 14.1781 23.5579C14.4165 23.9563 14.8555 24.1906 15.319 24.165C15.7824 24.1393 16.1937 23.8579 16.3867 23.4359L16.3883 23.4326L16.3949 23.418C16.4015 23.4037 16.4117 23.381 16.4258 23.3512C16.4541 23.2913 16.4988 23.2013 16.556 23.0843C16.6706 22.85 16.8416 22.508 17.0638 22.0882C17.509 21.2472 18.156 20.0968 18.9632 18.8607C20.6088 16.3408 22.8018 13.6492 25.1823 12.347C25.7875 12.0159 26.0108 11.2565 25.6803 10.651Z"
                    fill="#3CAC8E"
                  />
                </svg>
              </div>

              <h2 className="title">You’re All Done — Content Shared</h2>
              {showConfirmationModal.existingMember && (
                <div className="description-box">
                  <p className="description">
                    The HCP can now access the shared content directly on One
                    Source using their existing account.
                  </p>

                  <p className="note">
                    They’ll also receive an email shortly with a secure link to
                    the same content for reference.
                  </p>

                  <Button
                    type="button"
                    className="btn done"
                    onClick={handleCloseConfirmationModal}
                  >
                    Done
                  </Button>
                </div>
              )}
              {showConfirmationModal.newMember && (
                <div className="description-box">
                  <p className="description">
                    The HCP has been successfully registered, and the content
                    has been sent to:
                    <br />
                    <span className="email"> Example@gmail.com</span>
                  </p>

                  <p className="note">
                    They&apos;ll receive an email shortly with a secure link to
                    access the content on
                    <br />
                    <span className="highlight"> One Source.</span>
                  </p>

                  <Button
                    type="button"
                    className="btn done"
                    onClick={handleCloseConfirmationModal}
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
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
                        fillRule="evenodd"
                        clipRule="evenodd"
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
            ...JSON.parse(section.functional_tags || "[]").map(
              (tag) => "prefix_" + tag
            ),
          ]
            .sort((a, b) =>
              b
                .replace("prefix_", "")
                .localeCompare(a.replace("prefix_", ""), undefined, {
                  sensitivity: "base",
                })
            )
            .map((tag, idx) => (
              <div
                key={idx}
                className={`${tag.startsWith("prefix_") ? "f-tag" : "n-tag"}`}
              >
                {tag.replace("prefix_", "")}
              </div>
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
          class="dark-progress"
          style={{
            position: "absolute",
            top: "21px",
            left: 0,
            right: 0,
            bottom: "-3px",
            background: "rgba(24, 59, 77, 0.50)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px 8px 16px 16px",
            zIndex: 1000,
            backdropFilter: "blur(2px)",
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
                stroke="#ffffff"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke="#4CC6CF"
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
                fontWeight: "600",
                fontSize: "16px",
                color: "#ffffff",
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
