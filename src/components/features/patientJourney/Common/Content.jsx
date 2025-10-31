import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Form, Tab, Tabs } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import
{
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

const Content = ({ section: initialSection, idx, favTab }) =>
{
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
    checkbox4: false,
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

  useEffect(() =>
  {
    setQrCodeUrl({
      loading: false,
      error: false,
      data: "",
    });
  }, [showModal]);

  const filterCountries = () =>
  {
    const coutries = Object.entries(countryRegionArray).map(([country]) => ({
      value: country,
      label: country,
    }));
    setCountryList(coutries);
  };

  const handleTabSelect = async (key) =>
  {
    if (key === "existing-member") {
      try {
        if (!qrCodeUrl.data) await GenerateQrcodeUrl(section.id, setQrCodeUrl);
      } catch (ex) { }
    }
  };

  useEffect(() =>
  {
    filterCountries();
  }, [country]);

  const handleStarClick = async () =>
  {
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
    } catch (ex) { }
  };

  const getAgeGroup = () =>
  {
    const tags =
      section.age_groups !== "" ? JSON.parse(section.age_groups) : [];
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
        saveAs(content, section.title.replaceAll(" ", "_") + ".zip");
      }
      setDownloading(false);

      await TrackDownloads(section.id, setIsLoading, setToast);
    } catch (ex) {
      toast.error("Failed to download the content.");
    }
  };

  const handleCloseModal = () =>
  {
    setShowModal(false);
  };

  const handleSubmitClick = async (e) =>
  {
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
        newError.email = { error: true, message: "Email is required" };
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newError.email = {
          error: true,
          message: "Please enter valid email",
        };
      }

      if (!name) {
        newError.name = { error: true, message: "Name is required" };
      }

      if (!country) {
        newError.country = { error: true, message: "Country is required" };
      }

      if (
        !checkboxChecked.checkbox3 &&
        !checkboxChecked.checkbox4 &&
        !checkboxChecked.checkbox5 &&
        !checkboxChecked.checkbox6
      ) {
        newError.consent = { error: true, message: "Consent is required" };
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

  const handleCheckBoxClick = (name, isChecked) =>
  {
    let checkbox3 = false,
      checkbox4 = false,
      checkbox5 = false,
      checkbox6 = false;
    if (name === "checkbox3") {
      if (isChecked) {
        checkbox3 = true;
        if (checkboxChecked.checkbox4 || checkboxChecked.checkbox5) {
          checkbox4 = true;
          checkbox5 = true;
        }
      } else checkbox4 = checkboxChecked.checkbox4;
    } else if (name === "checkbox4") {
      if (isChecked) {
        checkbox4 = true;
        if (checkboxChecked.checkbox3 || checkboxChecked.checkbox5) {
          checkbox3 = true;
          checkbox5 = true;
        }
      } else checkbox3 = checkboxChecked.checkbox3;
    } else if (name === "checkbox5") {
      if (isChecked) {
        checkbox3 = true;
        checkbox4 = true;
        checkbox5 = true;
      }
    } else if (name === "checkbox6") {
      if (isChecked) checkbox6 = true;
    }

    setCheckboxChecked({
      checkbox3: checkbox3,
      checkbox4: checkbox4,
      checkbox5: checkbox5,
      checkbox6: checkbox6,
    });
  };

  const handleCloseConfirmationModal = () =>
  {
    setEmail("");
    setName("");
    setCountry("");
    setCheckboxChecked({
      checkbox3: false,
      checkbox4: true,
      checkbox5: false,
      checkbox6: false,
    });
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
                          className={`split-button ${error.country.error ? "error" : ""
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
                          id="checkbox3"
                          onChange={(e) =>
                            handleCheckBoxClick("checkbox3", e.target.checked)
                          }
                          checked={checkboxChecked.checkbox3}
                          label="Receive One Source updates and new materials from
                          Octapharma."
                          name="consent"
                        />
                        <Form.Check
                          type="checkbox"
                          id="checkbox4"
                          onChange={(e) =>
                            handleCheckBoxClick("checkbox4", e.target.checked)
                          }
                          checked={checkboxChecked.checkbox4}
                          label="Receive invitations to future events."
                          name="consent"
                        />
                        <Form.Check
                          type="checkbox"
                          id="checkbox5"
                          onChange={(e) =>
                            handleCheckBoxClick("checkbox5", e.target.checked)
                          }
                          checked={checkboxChecked.checkbox5}
                          label="Both of the options above."
                          name="consent"
                        />
                        <Form.Check
                          type="checkbox"
                          id="checkbox6"
                          onChange={(e) =>
                            handleCheckBoxClick("checkbox6", e.target.checked)
                          }
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
                      <div className="qr-skeleton">
                        <div className="skeleton-box"></div>
                        {/* <p>Generating your QR code...</p> */}
                      </div>
                    ) : (qrCodeUrl.error || !qrCodeUrl.data) ? (
                      <div className="qr-status error">
                        <img src={path_image + "error-alert.svg"} alt="error" />
                        <p>Failed to generate<br /> the QR code</p>
                      </div>
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
                    onClick={() =>
                    {
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
                <img src={path_image + "check-icon-img.png"} alt="success" />
              </div>

              <h2 className="title">You&apos;re All Done — Content Shared</h2>
              {showConfirmationModal.existingMember && (
                <div className="description-box">
                  <p className="description">
                    The HCP can now access the shared content directly on One
                    Source using their existing account.
                  </p>

                  <p className="note">
                    They&apos;ll also receive an email shortly with a secure
                    link to the same content for reference.
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
                    <span className="email"> {email}</span>
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
                    <img src={path_image + "share-img.svg"} alt="share" />
                    Share
                  </Dropdown.Item>
                )}{" "}
                {section.download == 1 && (
                  <Dropdown.Item onClick={handleDownloadClick}>
                    <img src={path_image + "download-img.svg"} alt="download" />
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
            JSON.parse(section.diagnosis).map((dgns, idx, arr) =>
            {
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
