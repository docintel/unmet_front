import { useCallback, useContext, useState } from "react";
import { ContentContext } from "../../../../../context/ContentContext";
import { Button } from "react-bootstrap";

const Category = ({
  activeKey,
  setActiveKey,
  activeJourney,
  isAllSelected,
}) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const { filterCategory } = useContext(ContentContext);
  const [hoverImage, setHoverImage] = useState({ id: -1, image: "" });
  const isTabDisabled = useCallback(
    (cat_id) => {
      if (!isAllSelected)
        return [5, 6].includes(cat_id) && [2, 3].includes(activeJourney);
      else return cat_id == 3;
    },
    [activeKey, isAllSelected, activeJourney]
  );

  return (
    <div className="touchpoint-links">
      {filterCategory.loading ? (
        <></>
      ) : filterCategory.error ? (
        <></>
      ) : (
        filterCategory.data &&
        filterCategory.data.length > 0 &&
        filterCategory.data.map((cat) => {
          let image = cat.image;
          const handleOnMauseLeave = () => {
            image = image.replace("hover-", "");
            setHoverImage({ id: cat.id, image: image });
          };
          const handleOnMauseEnter = () => {
            if (image.indexOf("hover-") === -1) {
              image = "hover-" + image;
              setHoverImage({ id: cat.id, image: image });
            }
          };
          return (
            <Button
              key={cat.id}
              onClick={() => {
                if (activeKey.id !== cat.id)
                  setActiveKey({ id: cat.id, name: cat.name });
                else setActiveKey({ id: null, name: "" });
              }}
              disabled={isTabDisabled(cat.id)}
              className={` ${
                isTabDisabled(cat.id)
                  ? "disabled"
                  : activeKey.id === cat.id
                  ? "active"
                  : ""
              }`}
              onMouseLeave={handleOnMauseLeave}
              onMouseEnter={handleOnMauseEnter}
            >
              {cat.name}
              <img
                src={
                  path_image +
                  "icons/" +
                  (hoverImage && hoverImage.id === cat.id
                    ? hoverImage.image
                    : cat.image)
                }
                alt="icon"
              />
            </Button>
          );
        })
      )}
    </div>
  );
};

export default Category;
