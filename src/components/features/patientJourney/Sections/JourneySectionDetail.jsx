import JourneySectionList from "./JourneySectionList";
import AskIBU from "./AskIBU";
import Faq from "./Faq";
import LatestContent from "./LatestContent";

export default function JourneySectionDetail({ onSectionClick, section })
{
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  return (
    <div
      className={`journey-boxes d-flex ${section.class != "ask-ibu" ? "flex-row-reverse" : ""
        }`}
    >
      <div className="left-side">
        <JourneySectionList onSectionClick={onSectionClick} section={section} />
      </div>
      <div className="right-side">
        <div className="box-top d-flex justify-content-between">
          <div className="latest-content-title">
            <img src={path_image + section.class + ".svg"} alt="" />
            <h6>{section.title}</h6>
            {/* <p>
              Lorem ipsum dolor sit amet consectetur. Odio erat sed vitae
              pulvinar fcilisis rhoncus vel morbi ullamcorper.{" "}
            </p> */}
          </div>
          <span
            onClick={() =>
            {
              onSectionClick(null);
            }}
          >
            <img src={path_image + "close-arrow.svg"} alt="" />
          </span>
        </div>
        <div className="data-box">
          {section.class === "ask-ibu" ? (
            <AskIBU />
          ) : section.class === "faq" ? (
            <Faq />
          ) : section.class === "latest-content" ? (
            <LatestContent />
          ) : null}
        </div>
      </div>
    </div>
  );
}
