import JourneySectionList from "./JourneySectionList";
import AskIBU from "./AskIBU";
import Faq from "./Faq";
import LatestContent from "./LatestContent";
import { useEffect, useState } from "react";

export default function JourneySectionDetail({ onSectionClick, section })
{
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [tempAnimationClass,setTempAnimationClass] = useState("");

  useEffect(() => {
    let interval = null;
    if (tempAnimationClass === "animate") {
      interval = setInterval(() => {
        setTempAnimationClass("");
        onSectionClick(null);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [tempAnimationClass])
  return (
    <div
      className={`journey-boxes d-flex ${section.class != "ask-ibu" ? "flex-row-reverse" : ""
        }`}
    >
      <div className="left-side">
        <JourneySectionList onSectionClick={onSectionClick} section={section} tempAnimationClass={tempAnimationClass} />
      </div>
      <div className={"right-side "+section.class + " " + tempAnimationClass}>
        <div className="box-top d-flex justify-content-between">
          <div className="latest-content-title">
            <img src={path_image + section.class + ".svg"} alt="" />
            <h6>{section.title}</h6>
          </div>
          <div className="cross-icon"
            onClick={() => {
              setTempAnimationClass("animate");
            }}
          >
            <img src={path_image + "cross-btn.svg"} alt="" />
          </div>
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
