import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import Content from "../Common/Content";
import { ContentContext } from "../../../../context/ContentContext";
import { toast } from "react-toastify";
import Pagination from "react-bootstrap/Pagination";
import { iconMapping } from "../../../../constants/iconMapping";

const TouchPoints = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [isAllSelected, setIsAllSelected] = useState(false);
  const toggleUserType = () => setIsAllSelected((prev) => !prev);
  const [activeKey, setActiveKey] = useState(null); // no tab selected initially
  const [activeJourney, setActiveJourney] = useState(null); // no journey selected initially
  const contentPerPage = 9;
  const [currentReadClick, setCurrentReadClick] = useState({
    previewArticle: null,
    id: null,
  });
  const {
    content,
    filterAges,
    filterCategory,
    narrative,
    categoryList,
    fetchAgeGroups,
    getNarratives,
  } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [categoryTags, setCategoryTags] = useState();
  const [activeNarration, setActiveNarration] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState([]);
  const [tags, setTags] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeAgeClass, setActiveAgeClass] = useState("");
  const [contentCategory, setContentCategory] = useState("All");
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [hoverImage, setHoverImage] = useState({ id: -1, image: "" });

  useEffect(() => {
    filterContents();
  }, [selectedTag]);

  useEffect(() => {
    if (contents) {
      const newArr =
        contentCategory === "All"
          ? contents
          : contents.filter((item) => contentCategory.includes(item.category));
      setFilteredContents(newArr);
      setTotalPages(Math.ceil(contents.length / contentPerPage));
      getCategoryTags(contents);
    }
  }, [contents]);

  useEffect(() => {
    (async () => {
      await fetchAgeGroups();
    })();
  }, []);

  useEffect(() => {
    filterContents();
  }, [contentCategory]);

  useEffect(() => {
    (async () => {
      await getNarratives(isAllSelected ? 2 : 1);
      setActiveKey(null);
      setActiveJourney(null);
      setActiveNarration(null);
      setSearchText("");
    })();
    if (isAllSelected) {
      const contentList = [];
      content.forEach((element) => {
        const ageArr = JSON.parse(element.age_groups);
        if (
          ageArr.includes("Age <6") ||
          ageArr.includes("Age 6-11") ||
          JSON.parse(element.diagnosis).includes("On-demand")
        )
          return;
        contentList.push(element);
      });
      setContents(contentList);
    } else setContents(content);
  }, [isAllSelected]);

  useEffect(() => {
    if (
      (contents && (activeKey || activeJourney)) ||
      (contents && searchText.trim() === "" && selectedTag.length === 0)
    ) {
      let tagArray = [];
      contents.map((item) => {
        tagArray = [...tagArray, ...JSON.parse(item.tags)];
      });

      const freqMap = {};
      for (const word of tagArray) {
        freqMap[word] = (freqMap[word] || 0) + 1;
      }

      const uniqueWords = Object.keys(freqMap);
      uniqueWords.sort((a, b) => {
        const freqDiff = freqMap[b] - freqMap[a];
        if (freqDiff !== 0) return freqDiff;
        return a.localeCompare(b);
      });
      setTags(uniqueWords);
    }
  }, [activeKey, activeJourney, contents]);

  useEffect(() => {
    filterContents();
    if (activeKey && activeJourney) {
      const activeNarrative = narrative.find(
        (narration) =>
          narration.category_id == activeKey &&
          narration.age_group_id == activeJourney
      );
      if (activeNarrative) setActiveNarration(activeNarrative);
      else setActiveNarration(null);
    } else if (activeKey || activeJourney) {
      setIsInfoVisible(false);
      const activeNarrative = activeKey
        ? narrative.filter((narration) => narration.category_id == activeKey)
        : narrative.filter(
            (narration) => narration.age_group_id == activeJourney
          );

      if (activeNarrative.length > 0)
        setActiveNarration(
          [...activeNarrative].sort((a, b) =>
            a.status.localeCompare(b.status, undefined, { sensitivity: "base" })
          )[0]
        );
      else setActiveNarration(null);
    } else setActiveNarration(null);
    setSearchText("");
  }, [activeKey, activeJourney]);

  useEffect(() => {
    if (searchText.length == 0) handleSearchClick();
  }, [searchText]);

  useEffect(() => {
    setContents(content);
    filterContents();
    if (content) getCategoryTags(content);
  }, [content]);

  const filterContents = () => {
    if (content) {
      const categoryNameFilter = filterCategory.find(
        (val) => val.id == activeKey
      );
      const categoryName = categoryNameFilter ? categoryNameFilter.name : "";

      const ageGroupFilter = filterAges.find((val) => val.id == activeJourney);
      const ageGroupName = ageGroupFilter
        ? ageGroupFilter.label
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .split("<br />")[1]
        : "";

      const filteredArray = [];
      content.map((item) => {
        if (
          item.age_groups.indexOf(ageGroupName) != -1 &&
          item.diagnosis.indexOf(categoryName) != -1 &&
          item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1
        )
          filteredArray.push(item);
      });

      let newArr =
        selectedTag.length === 0
          ? filteredArray
          : filteredArray.filter((item) => {
              const tagArray = JSON.parse(item.tags.toLowerCase());
              let count = 0;
              for (let i = 0; i < selectedTag.length; i++) {
                count = tagArray.includes(selectedTag[i].toLowerCase())
                  ? count + 1
                  : count;
              }
              return count === selectedTag.length ? true : false;
            });
      setContents(newArr);
    }
  };

  const isTabDisabled = useCallback(
    (cat_id, isCat) => {
      if (!isAllSelected)
        return (
          [5, 6].includes(isCat ? cat_id : activeKey) &&
          [2, 3].includes(isCat ? activeJourney : cat_id)
        );
      else {
        if (isCat) return cat_id == 3;
        else return [2, 3].includes(cat_id);
      }
    },
    [activeJourney, activeKey, narrative, isAllSelected]
  );

  const getCategoryTags = (content) => {
    if (categoryList) {
      const CategoryCount = { All: content.length };
      categoryList.map((cat) => {
        let count = 0;
        content.map((cntnt) => {
          if (cntnt.category === cat) count++;
        });
        CategoryCount[cat] = count;
      });

      setCategoryTags(CategoryCount);
    }
  };

  const handleSearchClick = (e) => {
    if (e) e.preventDefault();
    if (searchText.length >= 3 || searchText.length === 0) filterContents();
    else toast("Please enter at least three characters to search");
  };

  const handleSearchTextKeyUp = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag([...selectedTag, tag].sort());
    setTags([...tags].filter((tg) => tg !== tag).sort());
  };

  const removeFilter = (tag) => {
    setSelectedTag([...selectedTag].filter((tg) => tg !== tag).sort());
    setTags([...tags, tag].sort());
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <>
      <div className="main-page">
        {" "}
        <div className="custom-container">
          <Row>
            <div className={`touchpoints-section ${activeAgeClass}`}>
              <div className="patient-journey d-flex align-items-end w-100">
                <div className="switch">
                  <label className="switch-light">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleUserType}
                      style={{ margin: 0 }}
                    />
                    <span>
                      <span
                        className={`switch-btn ${
                          !isAllSelected ? "active" : ""
                        }`}
                      >
                        All
                      </span>
                      <span
                        className={`switch-btn ${
                          isAllSelected ? "active" : ""
                        }`}
                      >
                        Female
                      </span>
                    </span>
                    <a className="btn"></a>
                  </label>
                </div>
                <div className="journey-link-list d-flex align-items-center justify-content-between w-100 gap-2">
                  {filterAges &&
                    filterAges.map((lbl) => (
                      <React.Fragment key={lbl.id}>
                        <div
                          key={lbl.id}
                          className={`journey-link ${
                            activeJourney === lbl.id ? "active" : ""
                          } ${isTabDisabled(lbl.id, false) ? "disabled" : ""}`}
                          // dangerouslySetInnerHTML={{ __html: label }}
                          onClick={() => {
                            if (!isTabDisabled(lbl.id, false)) {
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

                              if (activeJourney !== lbl.id)
                                setActiveJourney(lbl.id);
                              else setActiveJourney(null);
                            }
                          }}
                        >
                          <div className="userImg">
                            <img
                              src={
                                path_image +
                                "ages/" +
                                (!isAllSelected
                                  ? lbl.allImage
                                  : lbl.femaleImage)
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
                        {lbl.id !== filterAges.length + 1 && (
                          <div
                            className={`line ${
                              isTabDisabled(lbl.id, false) ? "disabled" : ""
                            }`}
                          ></div>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
              <div className="touchpoint-box">
                <div className="touchpoints-header">
                  <div className="touchpoint-links">
                    {filterCategory &&
                      filterCategory.map((cat) => {
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
                              if (activeKey !== cat.id) setActiveKey(cat.id);
                              else setActiveKey(null);
                            }}
                            disabled={isTabDisabled(cat.id, true)}
                            className={` ${
                              isTabDisabled(cat.id, true)
                                ? "disabled"
                                : activeKey === cat.id
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
                      })}
                  </div>
                </div>
                <div className="touchpoint-box-inner">
                  {activeNarration ? (
                    activeNarration.status === "Missing" ? (
                      <div className="message-info">
                        <div className="message">
                          <div className="info-icon">
                            <img src={path_image + "info-icon.svg"} alt="" />
                          </div>
                          <p className="info-text">
                            Narrative in preparation...
                          </p>
                        </div>
                      </div>
                    ) : activeNarration.status === "Not applicable" ? (
                      <div className="message-info">
                        <div className="message">
                          <div className="info-icon">
                            <img src={path_image + "info-icon.svg"} alt="" />
                          </div>
                          <p className="info-text">
                            Narrative in preparation...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="touchpoint-data">
                        {/* <h6>Short Narrative</h6> */}
                        <div className="d-flex justify-content-between narrative-block">
                          <div className="content">
                            <p className="content-title">
                              {activeNarration.narrative_title}
                            </p>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: activeNarration.narrative_description,
                              }}
                            ></div>
                          </div>
                          <div className="content">
                            <p className="content-title">
                              {activeNarration.contibution_title}
                            </p>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: activeNarration.contibution_description,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  ) : null}
                  <div
                    className="text-center dummy_data"
                    style={{
                      maxHeight: isInfoVisible ? "300px" : "0px",
                      opacity: isInfoVisible ? 1 : 0,
                      overflow: "hidden",
                      transform: isInfoVisible
                        ? "translateY(0)"
                        : "translateY(-20px)",
                      transition: "all 0.5s ease",
                      padding: isInfoVisible ? "32px 12px" : "0",
                      margin: isInfoVisible ? "32px 0px 50px" : "0",
                    }}
                  >
                    <div className="close-icon">
                      <img
                        src={path_image + "cross-btn.svg"}
                        alt="No Data"
                        onClick={() => setIsInfoVisible(false)}
                      />
                    </div>
                    <img
                      src={path_image + "info-banner.png"}
                      alt="No Data"
                      style={{ userSelect: "none" }}
                    />
                  </div>
                  <div className="search-bar">
                    <Form
                      className="d-flex"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="inner-search d-flex align-items-center">
                        {selectedTag.length > 0 && (
                          <div className="tag-list d-flex">
                            {selectedTag &&
                              selectedTag.map((tag, idx) => (
                                <span key={idx} className="tag-item">
                                  {tag}{" "}
                                  <button
                                    className="cross-btn"
                                    onClick={() => removeFilter(tag)}
                                  >
                                    ✖
                                  </button>
                                </span>
                              ))}
                          </div>
                        )}
                        <Form.Control
                          type="search"
                          aria-label="Search"
                          placeholder="Search by tag or content title"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          onKeyUp={handleSearchTextKeyUp}
                        />
                      </div>
                      <Button
                        variant="outline-success"
                        onClick={handleSearchClick}
                      >
                        <img
                          src={path_image + "search-icon.svg"}
                          alt="Search"
                        />
                      </Button>
                    </Form>
                  </div>
                  <div className="tags d-flex">
                    <div className="tag-title">Topics:</div>
                    <div className="tag-list d-flex">
                      {tags &&
                        tags.map((tag, idx) => (
                          <div
                            className="tag-item"
                            key={idx}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </div>
                        ))}
                      <Button
                        className="show-more-btn"
                        // Add class "show-less-btn" show less tags
                        onClick={""}
                      >
                        <span>Show more</span>
                        <img
                          src={`${path_image}right-arrow.svg`}
                          alt="Show more"
                          className="arrow-icon"
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="content-count-box">
                    <div className="content-count">
                      {categoryTags &&
                        Object.keys(categoryTags).map((cat, idx) => {
                          return (
                            <div
                              className={`filter ${
                                contentCategory === cat ? "active" : ""
                              }`}
                              style={{ cursor: "pointer", userSelect: "none" }}
                              key={idx}
                              onClick={() => setContentCategory(cat)}
                            >
                              <img
                                src={
                                  path_image +
                                  "icons/" +
                                  iconMapping.category[cat]
                                }
                                alt=""
                              />
                              {cat}
                              <br />
                              <div>
                                <span>{categoryTags[cat]}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="touchpoint-data-boxes">
                      {" "}
                      {filteredContents && filteredContents.length > 0 ? (
                        filteredContents &&
                        filteredContents.map(
                          (section, idx) =>
                            idx >= (activePage - 1) * contentPerPage &&
                            idx < activePage * contentPerPage && (
                              <React.Fragment key={section.id}>
                                <Content
                                  section={section}
                                  idx={section.id}
                                  key={idx}
                                  currentReadClick={currentReadClick}
                                  setCurrentReadClick={setCurrentReadClick}
                                />
                              </React.Fragment>
                            )
                        )
                      ) : (
                        <div className="no-data">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12.9992 0.083374C5.86551 0.083374 0.0825195 5.86636 0.0825195 13C0.0825195 20.1337 5.86551 25.9167 12.9992 25.9167C16.1171 25.9166 18.9771 24.8119 21.2088 22.9724L23.7788 25.544C23.1258 26.9228 23.3658 28.6187 24.5063 29.7595L29.5747 34.8278C31.0256 36.2787 33.3777 36.2787 34.8286 34.8278C36.2796 33.3769 36.2796 31.0249 34.8286 29.5739L29.7603 24.5056C28.62 23.3655 26.9249 23.1245 25.5464 23.7764L22.9748 21.2048C24.8118 18.9737 25.9159 16.1158 25.9159 13C25.9159 5.86657 20.1326 0.0837142 12.9992 0.083374ZM26.2739 26.2732C26.7485 25.7986 27.518 25.7988 27.9927 26.2732L33.061 31.3415C33.5357 31.8161 33.5357 32.5856 33.061 33.0603C32.5864 33.5348 31.8169 33.5349 31.3423 33.0603L26.2739 27.9919C25.7996 27.5173 25.7995 26.7477 26.2739 26.2732ZM12.9992 2.58337C18.7519 2.58371 23.4159 7.24728 23.4159 13C23.4159 18.7528 18.7519 23.4164 12.9992 23.4167C7.24622 23.4167 2.58252 18.753 2.58252 13C2.58252 7.24707 7.24622 2.58337 12.9992 2.58337Z"
                              fill="#94A7BF"
                              fillOpacity="0.2"
                            />
                          </svg>
                          <h5>
                            Hmm… nothing here yet.
                            <br />
                            Try searching with different topics or title.
                          </h5>
                        </div>
                      )}
                    </div>
                    <div>
                      {totalPages && totalPages > 1 ? (
                        <Pagination>
                          <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={activePage === 1}
                            style={{ marginLeft: "auto" }}
                          />
                          <Pagination.Prev
                            onClick={() => handlePageChange(activePage - 1)}
                            disabled={activePage === 1}
                          />

                          {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                              key={index + 1}
                              active={index + 1 === activePage}
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </Pagination.Item>
                          ))}

                          <Pagination.Next
                            onClick={() => handlePageChange(activePage + 1)}
                            disabled={activePage === totalPages}
                          />
                          <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={activePage === totalPages}
                          />
                        </Pagination>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
};

export default TouchPoints;
