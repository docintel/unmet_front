import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Modal from "react-bootstrap/Modal";
import {
  TrackDownloads,
  updateContentRating,
} from "../../../../services/touchPointServices";
import IframeComponent from "./IframeComponent";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { iconMapping } from "../../../../constants/iconMapping";
import { trackingUserAction } from "../../../../helper/helper";
import ShareContentPopup from "./ShareContentPopup";

const Content = ({ section, idx, favTab }) => {
  const staticUrl = import.meta.env.VITE_AWS_DOWNLOAD_URL;
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const {
    filterCategory,
    isHcp,
    updateRating,
    setIsLoading,
    setToast,
    currentTabValue,
    contentHolder,
    updateDownload,
  } = useContext(ContentContext);
  const iframeRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [readContent, setReadContent] = useState(false);
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [ratingFocus, setRatingFocus] = useState(false);
  const circumference = 2 * Math.PI * 45;

  const handleStarClick = async () => {
    try {
      const selfRate = section.self_rate === 1 ? 0 : 1;
      trackingUserAction(
        "content_like_clicked",
        {
          title: section?.title,
          pdf_id: section?.id,
          contentHolder: contentHolder,
        },
        currentTabValue
      );
      const response = await updateContentRating(
        section.id,
        setIsLoading,
        setToast
      );
      updateRating(section.id, response.response, selfRate);
      if (selfRate === 1) {
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
        await getContentSize(downloadUrl);
        const blob = await downloadFileChuck(downloadUrl);
        const extenstion = downloadUrl.split("/").pop().split(".").pop();
        saveAs(blob, section.title.replaceAll(" ", "_") + "." + extenstion);
        setDownloading(false);
      } else if (section.file_type.toLowerCase() === "iframe") {
        const downloadUrl = section.pdf_files.split("=")[1];
        await getContentSize(downloadUrl);
        const blob = await downloadFileChuck(downloadUrl);

        const extenstion = downloadUrl.split("/").pop().split(".").pop();
        saveAs(blob, section.title.replaceAll(" ", "_") + "." + extenstion);
        setDownloading(false);
      } else {
        setDownloading(true);
        const zip = new JSZip();
        const fileLinks = section.pdf_files.split(",");
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
      updateDownload();
      await TrackDownloads(section.id, setIsLoading, setToast);
    } catch (ex) {
      console.log(ex);
      setToast({
        show: true,
        type: "danger",
        title: "Error",
        message: "Failed to download the content.",
      });
      setDownloading(false);
    } finally {
      setProgress(0);
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setToast({
          show: true,
          type: "success",
          title: "Link copied!",
          message: "The article link has been successfully copied.",
        });
      })
      .catch(err => {
        console.log(err);
        setToast({
          show: true,
          type: "danger",
          title: "Error",
          message: "Failed to copy the link.",
        });
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
      <ShareContentPopup
        section={section}
        showModal={showModal}
        setShowModal={setShowModal}
      />
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
                {section.share == 1 && isHcp && (
                  <>
                  <Dropdown.Item
                    // onClick={handleShareClick}
                    onClick={async () => {
                      handleShareClick();
                      trackingUserAction(
                        "share_clicked",
                        {
                          title: section?.title,
                          pdf_id: section?.id,
                          contentHolder: contentHolder,
                        },
                        currentTabValue
                      );
                    }}
                  >
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
                    <Dropdown.Item
                      onClick={async () => {
                      handleCopy(section?.docintelLink);
                      trackingUserAction(
                        "copy_content_link",
                        {
                          title: section?.title,
                          pdf_id: section?.id,
                          contentHolder: contentHolder,
                        },
                        currentTabValue
                      );
                    }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.91602 1.04199C9.27049 1.04199 10.3413 1.04135 11.1867 1.14128C12.0458 1.24283 12.7533 1.4556 13.3441 1.94043C13.5444 2.10486 13.7282 2.28859 13.8926 2.48893C14.352 3.04875 14.5677 3.71337 14.6755 4.51286C14.7629 5.16211 14.7833 5.9439 14.7886 6.88509C15.3072 6.89587 15.7626 6.91888 16.159 6.97217C16.9091 7.07301 17.5406 7.28926 18.0422 7.79085C18.5438 8.29245 18.76 8.9239 18.8608 9.67399C18.9592 10.4061 18.9577 11.3396 18.9577 12.5003V13.3337C18.9577 14.4944 18.9592 15.4279 18.8608 16.16C18.76 16.9101 18.5438 17.5415 18.0422 18.0431C17.5406 18.5447 16.9091 18.761 16.159 18.8618C15.4269 18.9602 14.4934 18.9587 13.3327 18.9587H12.4993C11.3386 18.9587 10.4051 18.9602 9.67301 18.8618C8.92293 18.761 8.29147 18.5447 7.78988 18.0431C7.28828 17.5415 7.07204 16.9101 6.97119 16.16C6.91791 15.7636 6.8949 15.3081 6.88411 14.7896C5.94293 14.7843 5.16113 14.7639 4.51188 14.6764C3.71239 14.5687 3.04778 14.353 2.48796 13.8936C2.28762 13.7291 2.10388 13.5454 1.93945 13.3451C1.45462 12.7543 1.24186 12.0468 1.1403 11.1877C1.04038 10.3423 1.04102 9.27147 1.04102 7.91699C1.04102 6.56252 1.04038 5.49167 1.1403 4.64632C1.24186 3.78722 1.45462 3.0797 1.93945 2.48893C2.10388 2.28859 2.28762 2.10486 2.48796 1.94043C3.07872 1.4556 3.78624 1.24283 4.64534 1.14128C5.49069 1.04135 6.56154 1.04199 7.91602 1.04199ZM12.4993 8.12533C11.3034 8.12533 10.4693 8.12701 9.83984 8.21159C9.22836 8.2938 8.9043 8.44401 8.67367 8.67464C8.44303 8.90528 8.29282 9.22934 8.21061 9.84082C8.12603 10.4702 8.12435 11.3044 8.12435 12.5003V13.3337C8.12435 14.5296 8.12603 15.3637 8.21061 15.9932C8.29282 16.6046 8.44303 16.9287 8.67367 17.1593C8.9043 17.39 9.22837 17.5402 9.83984 17.6224C10.4693 17.707 11.3034 17.7087 12.4993 17.7087H13.3327C14.5286 17.7087 15.3628 17.707 15.9922 17.6224C16.6037 17.5402 16.9277 17.39 17.1584 17.1593C17.389 16.9287 17.5392 16.6046 17.6214 15.9932C17.706 15.3637 17.7077 14.5296 17.7077 13.3337V12.5003C17.7077 11.3044 17.706 10.4702 17.6214 9.84082C17.5392 9.22934 17.389 8.90528 17.1584 8.67464C16.9277 8.44401 16.6037 8.2938 15.9922 8.21159C15.3628 8.12701 14.5286 8.12533 13.3327 8.12533H12.4993ZM7.91602 2.29199C6.53092 2.29199 5.54676 2.29309 4.79183 2.38232C4.0511 2.46991 3.6125 2.63481 3.28141 2.90641C3.14428 3.01896 3.01798 3.14526 2.90544 3.28239C2.63383 3.61348 2.46894 4.05208 2.38135 4.79281C2.29211 5.54773 2.29102 6.5319 2.29102 7.91699C2.29102 9.30208 2.29211 10.2863 2.38135 11.0412C2.46894 11.7819 2.63383 12.2205 2.90544 12.5516C3.01798 12.6887 3.14428 12.815 3.28141 12.9276C3.59547 13.1852 4.00659 13.3471 4.67952 13.4378C5.24529 13.514 5.94949 13.5333 6.87435 13.5387V12.5003C6.87435 11.3396 6.87278 10.4061 6.97119 9.67399C7.07204 8.9239 7.28828 8.29245 7.78988 7.79085C8.29147 7.28926 8.92292 7.07301 9.67301 6.97217C10.4051 6.87376 11.3386 6.87533 12.4993 6.87533H13.5378C13.5323 5.95047 13.5131 5.24627 13.4368 4.6805C13.3462 4.00757 13.1842 3.59645 12.9266 3.28239C12.8141 3.14526 12.6878 3.01896 12.5506 2.90641C12.2195 2.63481 11.7809 2.46991 11.0402 2.38232C10.2853 2.29309 9.30111 2.29199 7.91602 2.29199Z" fill="var(--gray)" />
                      </svg>
                      Copy link
                    </Dropdown.Item>
                  </>
                )}{" "}
                {section.download == 1 && (
                  <Dropdown.Item
                    // onClick={handleDownloadClick}
                    onClick={async () => {
                      handleDownloadClick();
                      trackingUserAction(
                        "download_clicked",
                        {
                          title: section?.title,
                          pdf_id: section?.id,
                          contentHolder: contentHolder,
                        },
                        currentTabValue
                      );
                    }}
                  >
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
              a
                .replace("prefix_", "")
                .localeCompare(b.replace("prefix_", ""), undefined, {
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
                  path_image +
                  (ratingFocus
                    ? "star-focus.svg"
                    : isStarHovered
                    ? "star-hover.svg"
                    : section.self_rate
                    ? "star-filled.svg"
                    : "star-img.svg")
                }
                onMouseDown={() => setRatingFocus(true)}
                onMouseUp={() =>
                  setTimeout(() => {
                    setRatingFocus(false);
                  }, 1000)
                }
                alt=""
                style={{ cursor: "pointer" }}
                onClick={handleStarClick}
                onMouseEnter={() => setIsStarHovered(true)}
                onMouseLeave={() => {
                  setIsStarHovered(false);
                  setTimeout(() => {
                    setRatingFocus(false);
                  }, 1000);
                }}
              />
            )}
            {favTab ? null : section.rating}
          </div>
          <Button
            variant="primary"
            onClick={async (e) => {
              if (!readContent) {
                trackingUserAction(
                  "view_clicked",
                  {
                    title: section?.title,
                    pdf_id: section?.id,
                    contentHolder: contentHolder,
                  },
                  currentTabValue
                );
              }
              setReadContent(!readContent);
            }}
          >
            {readContent ? "Close" : "View"}
          </Button>
        </div>
        {/* Transparent overlay with circular progress */}
        {downloading && (
          <div
            className="dark-progress"
            style={{
              position: "absolute",
              top: "0px",
              left: 0,
              right: 0,
              bottom: "0px",
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
              <img src={path_image + "left-white-arrow.svg"} alt="Back" />
              <span>Back</span>
            </button>

            <div className="modal-title">{section?.title}</div>

            <div className="modal-logo">
              <img src={path_image + "vwd-journey-logo.svg"} alt="Logo" />
            </div>
          </Modal.Header>

          <Modal.Body className="custom-modal-body">
            <div className="content-data" ref={iframeRef}>
              <IframeComponent previewArticle={section.previewArticle} />
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Content;
