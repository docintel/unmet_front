import React, { useCallback, useContext } from "react";
import { ContentContext } from "../../../../../context/ContentContext";

const AgeGroups = ({
  activeJourney,
  setActiveJourney,
  setActiveAgeClass,
  isAllSelected,
  activeKey,
}) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const { filterAges } = useContext(ContentContext);
  const isTabDisabled = useCallback(
    (cat_id) => {
      if (!isAllSelected)
        return [5, 6].includes(activeKey.id) && [2, 3].includes(cat_id);
      else return [2, 3].includes(cat_id);
    },
    [activeJourney, activeKey, isAllSelected]
  );

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
              } ${isTabDisabled(lbl.id) ? "disabled" : ""}`}
              onClick={() => {
                if (!isTabDisabled(lbl.id)) {
                  const agesList = lbl.label
                    .replace("&lt;", "")
                    .replace("&gt;", "")
                    .split("<br />")[1]
                    .split(" ")[1]
                    .split("-");
                  let ageName = "";
                  if (agesList.length === 1 && agesList[0] === "6")
                    ageName = "age" + "0";
                  else ageName = "age" + agesList[0];
                  setActiveAgeClass(ageName);

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
