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

  return (
    <div className="journey-link-list d-flex align-items-center justify-content-between w-100 gap-2">
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
              key={lbl.id}
              className={`journey-link ${
                activeJourney.id === lbl.id ? "active" : ""
              } ${isTabDisabled(lbl.id) ? "disabled" : ""} ${getClassName(
                lbl.label
              )}`}
              onClick={async () => {
                const ageName = getClassName(lbl.label);
                setActiveAgeClass(ageName);
                trackingUserAction("associated_age_clicked",stripHTML(lbl.label),currentTabValue);
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
    </div>
  );
};

export default AgeGroups;
