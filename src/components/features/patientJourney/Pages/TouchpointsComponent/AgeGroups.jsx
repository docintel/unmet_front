import React, { useCallback, useContext, useState } from "react";
import { ContentContext } from "../../../../../context/ContentContext";
import { trackingUserAction } from "../../../../../helper/helper";
import { stripHTML } from "../../../../../helper/helper";

const AgeGroups = ({
  activeJourney,
  setActiveJourney,
  setActiveAgeClass,
  isAllSelected,
  activeKey,
}) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const { filterAges,currentTabValue } = useContext(ContentContext);
  const isTabDisabled = useCallback(
    (cat_id) => {
      if (!isAllSelected) {
        const isDisabled =
          [5, 6].includes(activeKey.id) && [2, 3].includes(cat_id);
        return isDisabled;
      } else {
        const isDisabled = [2, 3].includes(cat_id);
        return isDisabled;
      }
    },
    [activeJourney, activeKey, isAllSelected]
  );

  const getClassName = (label) => {
    const agesList = label
      .replace("&lt;", "")
      .replace("&gt;", "")
      .split("<br />")[1]
      .split(" ")[1]
      .split("-");
    let ageName = "";
    if (agesList.length === 1 && agesList[0] === "6") ageName = "age" + "0";
    else ageName = "age" + agesList[0];

    return ageName;
  };

  const containerRef = React.useRef(null);
  const boxRef = React.useRef(null);

  // position the floating journey-link-box under the active .journey-link
  React.useEffect(() => {
    const container = containerRef.current;
    const box = boxRef.current;
    if (!container || !box) return;

    // ensure container is positioned to allow absolutely positioned box
    if (window.getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    const placeBox = () => {
      const activeEl = container.querySelector(".journey-link.active");
      const containerRect = container.getBoundingClientRect();

      // default hidden state
      if (!activeEl) {
        box.style.opacity = "0";
        box.style.transform = `translateX(0px)`;
        return;
      }

      const elRect = activeEl.getBoundingClientRect();
      const left = elRect.left - containerRect.left;
      const width = Math.round(elRect.width);
      const boxHeight = 66; // px, adjust if needed

      // apply styles & animate
      box.style.opacity = "1";
      box.style.width = `${width}px`;
      box.style.height = `${boxHeight}px`;
      box.style.bottom = "0"; // place at bottom of container
      box.style.transform = `translateX(${left}px)`;
    };

    // initial placement
    placeBox();

    // reposition on resize or fonts/layout changes
    const handleResize = () => placeBox();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeJourney, filterAges.data, isAllSelected, activeKey]);

  return (
    <div
      ref={containerRef}
      className="journey-link-list d-flex align-items-center justify-content-between w-100 gap-2"
    >
      {filterAges.loading ? (
        <></>
      ) : filterAges.error ? (
        <></>
      ) : (
        filterAges.data &&
        filterAges.data.length > 0 &&
        filterAges.data.map((lbl) => (
          <React.Fragment key={lbl.id}>
            <div
              className={`journey-link ${
                activeJourney.id === lbl.id ? "active" : ""
              } ${isTabDisabled(lbl.id) ? "disabled" : ""} ${getClassName(
                lbl.label
              )}`}
              onClick={async () => {
                const ageName = getClassName(lbl.label);
                setActiveAgeClass(ageName);
                trackingUserAction(
                  "associated_age_clicked",
                  stripHTML(lbl.label),
                  currentTabValue
                );
                if (!isTabDisabled(lbl.id)) {
                  if (activeJourney.id !== lbl.id)
                    setActiveJourney({ id: lbl.id, label: lbl.label });
                  else {
                    setActiveJourney({ id: null, label: "" });
                    setActiveAgeClass("");
                  }
                }
              }}
            >
              <div className="userImg">
                <img
                  src={
                    path_image +
                    "ages/" +
                    (!isAllSelected ? lbl.allImage : lbl.femaleImage)
                  }
                  alt=""
                />
              </div>
              <div
                className="user-category"
                dangerouslySetInnerHTML={{
                  __html: lbl.label,
                }}
              ></div>
            </div>
            {lbl.id !== filterAges.data.length + 1 && (
              <div
                className={`line ${isTabDisabled(lbl.id) ? "disabled" : ""}`}
              ></div>
            )}
          </React.Fragment>
        ))
      )}
      {/* floating animated indicator */}
      <div
        ref={boxRef}
        className="journey-link-box"
        style={{
          position: "absolute",
          left: 0,
          // top/width/height/transform/opacity are controlled in effect
          transition:
            "transform 200ms ease, width 200ms ease, opacity 200ms ease, bottom 200ms ease",
          transform: "translateX(0px)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 5,
        }}
      ></div>
    </div>
  );
};

export default AgeGroups;
