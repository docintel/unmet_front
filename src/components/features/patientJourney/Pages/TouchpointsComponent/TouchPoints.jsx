import React, {
  lazy,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, Form, Row } from "react-bootstrap";
// import Content from "../Common/Content";
import { ContentContext } from "../../../../../context/ContentContext";
import { iconMapping } from "../../../../../constants/iconMapping";
import FixedSizeList from "../../Common/FixedSizedList";
import Category from "./Category";
import AgeGroups from "./AgeGroups";
import ActiveNarration from "./ActiveNarration";

const Content = lazy(() => import("../../Common/Content"));

const TouchPoints = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [isAllSelected, setIsAllSelected] = useState(false);
  const toggleUserType = () => setIsAllSelected((prev) => !prev);
  const [activeKey, setActiveKey] = useState({ id: null, name: "" }); // no tab selected initially
  const [activeJourney, setActiveJourney] = useState({ id: null, label: "" }); // no journey selected initially

  const {
    content,
    filterAges,
    filterCategory,
    narrative,
    filterTag,
    isHcp,
    categoryList,
    fetchAgeGroups,
    getNarratives,
    setToast,
  } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [categoryTags, setCategoryTags] = useState();
  const [activeNarration, setActiveNarration] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeAgeClass, setActiveAgeClass] = useState("");
  const [contentCategory, setContentCategory] = useState("All");
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [tagShowAllClicked, setTagShowAllClicked] = useState(false);
  const [expandNarrative, setExapandNarrative] = useState(false);
  const [searchBackspace, setSearchBackspace] = useState(false);
  useEffect(() => {
    filterContents();
    filterTags();
  }, [selectedTag]);

  useEffect(() => {
    if (contents) {
      const newArr =
        contentCategory === "All"
          ? contents.filter((item) => item.category.toLowerCase() !== "faq")
          : contents.filter(
              (item) =>
                contentCategory.includes(item.category) &&
                item.category.toLowerCase() !== "faq"
            );
      setFilteredContents(newArr);
      getCategoryTags(contents);
    }
  }, [contents, categoryList]);

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
      setActiveKey({ id: null, name: "" });
      setActiveJourney({ id: null, label: "" });
      setActiveNarration(null);
      setSearchText("");
    })();
    filterContents();
  }, [isAllSelected]);

  useEffect(() => {
    filterTags();
  }, [activeKey, activeJourney, isAllSelected]);

  useEffect(() => {
    filterContents();
    if (activeKey.id && activeJourney.id) {
      const activeNarrative = narrative.find(
        (narration) =>
          narration.category_id == activeKey.id &&
          narration.age_group_id == activeJourney.id
      );
      if (activeNarrative) setActiveNarration(activeNarrative);
      else setActiveNarration(null);
    } else if (activeKey.id || activeJourney.id) {
      setIsInfoVisible(false);
      const activeNarrative = activeKey.id
        ? narrative.filter((narration) => narration.category_id == activeKey.id)
        : narrative.filter(
            (narration) => narration.age_group_id == activeJourney.id
          );
      if (activeNarrative.length > 0) setActiveNarration(activeNarrative[0]);
      else setActiveNarration(null);
    } else setActiveNarration(null);
    setSearchText("");
    setExapandNarrative(false);
  }, [activeKey, activeJourney]);

  useEffect(() => {
    if (searchText.length == 0) {
      if (!searchBackspace) setSelectedTag([]);
      handleSearchClick();
    }
  }, [searchText]);

  useEffect(() => {
    setContents(content.data);
    if (!content.pending && !content.error) {
      getCategoryTags(content.data);
      filterContents();
      filterTags();
    }
  }, [content]);

  const filterTags = () => {
    if (content) {
      let tagArray = [];
      if (activeKey.id || activeJourney.id) {
        let tempContent = [];
        const age = activeJourney.label
          .replace("&lt;", "<")
          .replace("&gt;", ">")
          .split("<br />")[1];
        const catg = activeKey.name;

        if (!activeKey.id)
          tempContent = content.data.filter((item) =>
            JSON.parse(item.age_groups ? item.age_groups : "[]").includes(age)
          );
        else if (!activeJourney.id)
          tempContent = content.data.filter((item) =>
            JSON.parse(item.diagnosis ? item.diagnosis : "[]").includes(catg)
          );
        else {
          tempContent = content.data.filter(
            (item) =>
              JSON.parse(item.diagnosis ? item.diagnosis : "[]").includes(
                catg
              ) &&
              JSON.parse(item.age_groups ? item.age_groups : "[]").includes(age)
          );
        }

        if (isAllSelected)
          tempContent = tempContent.filter(
            (item) => item.female_oriented === (isAllSelected ? 1 : 0)
          );

        tempContent.map((item) => {
          try {
            if (item.tags !== "")
              tagArray = [
                ...tagArray,
                ...JSON.parse(item.tags ? item.tags : "[]"),
                ...JSON.parse(
                  item.functional_tags ? item.functional_tags : "[]"
                ).map((tag) => "prefix_" + tag),
              ];
          } catch (ex) {}
        });
      } else {
        let tempContent = [];
        if (isAllSelected)
          tempContent = content.data.filter(
            (item) => item.female_oriented === (isAllSelected ? 1 : 0)
          );
        else tempContent = content.data;
        tempContent.map((item) => {
          try {
            if (item.tags !== "")
              tagArray = [
                ...tagArray,
                ...JSON.parse(item.tags ? item.tags : "[]"),
                ...JSON.parse(
                  item.functional_tags ? item.functional_tags : "[]"
                ).map((tag) => "prefix_" + tag),
              ];
          } catch (ex) {}
        });
      }
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
      setTags(uniqueWords.filter((tg) => !selectedTag.includes(tg)));
    }
  };

  const filterContents = () => {
    if (content) {
      if (isAllSelected) {
        const contentList = [];
        content.data.forEach((element) => {
          if (element.female_oriented === 0) return;

          for (let i = 0; i < selectedTag.length; i++) {
            if (
              ![
                ...JSON.parse(element.tags ? element.tags.toLowerCase() : "[]"),
                ...JSON.parse(
                  element.functional_tags
                    ? element.functional_tags.toLowerCase()
                    : "[]"
                ).map((tag) => "prefix_" + tag),
              ].includes(selectedTag[i].toLowerCase())
            )
              return;
          }
          if (
            element.title
              .toLowerCase()
              .indexOf((searchText || "").toLowerCase()) == -1
          )
            return;

          for (let i = 0; i < filterAges.data.length; i++) {
            if (
              activeJourney.id &&
              filterAges.data[i].id === activeJourney.id
            ) {
              const ageGroup = filterAges.data[i].label.split("<br />")[1];
              if (
                !JSON.parse(
                  element.age_groups ? element.age_groups : "[]"
                ).includes(ageGroup)
              )
                return;
            }
          }

          for (let i = 0; i < filterCategory.data.length; i++) {
            if (activeKey.id && filterCategory.data[i].id === activeKey.id) {
              if (
                !JSON.parse(
                  element.diagnosis ? element.diagnosis : "[]"
                ).includes(filterCategory.data[i].name)
              )
                return;
            }
          }

          if (isHcp && element.hide_in_hcp === 1) return;

          contentList.push(element);
        });

        setContents(contentList);
      } else {
        const categoryName = activeKey.id ? activeKey.name : "";

        const ageGroupName = activeJourney.id
          ? activeJourney.label
              .replace("&lt;", "<")
              .replace("&gt;", ">")
              .split("<br />")[1]
          : "";

        const filteredArray = [];
        content.data.map((item) => {
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
                const tagArray = [
                  ...JSON.parse(item.tags ? item.tags.toLowerCase() : "[]"),
                  ...JSON.parse(
                    item.functional_tags
                      ? item.functional_tags.toLowerCase()
                      : "[]"
                  ).map((tag) => "prefix_" + tag),
                ];
                let count = 0;
                for (let i = 0; i < selectedTag.length; i++) {
                  count = tagArray.includes(selectedTag[i].toLowerCase())
                    ? count + 1
                    : count;
                }

                return count === selectedTag.length;
              });
        setContents(newArr);
      }
    }
  };

  const getCategoryTags = (content) => {
    if (categoryList) {
      try {
        const CategoryCount = {
          All: content.filter((item) => item.category.toLowerCase() !== "faq")
            .length,
        };
        categoryList.map((cat) => {
          let count = 0;
          content.map((cntnt) => {
            if (cntnt.category === cat) count++;
          });
          CategoryCount[cat] = count;
        });
        setCategoryTags(CategoryCount);
      } catch (err) {
        console.error("Error in getCategoryTags:", err);
      }
    }
  };

  const handleSearchClick = async (e) => {
    if (e) e.preventDefault();
    if (searchText.length >= 3 || searchText.length === 0) filterContents();
    else
      setToast({
        type: "danger",
        title: "Error",
        message: "Please enter at least three characters to search",
        show: true,
      });
  };

  const handleSearchTextKeyUp = (e) => {
    if (e.key === "Backspace") setSearchBackspace(true);
    else setSearchBackspace(false);
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag([...selectedTag, tag]);
  };

  const removeFilter = (tag) => {
    setSelectedTag([...selectedTag].filter((tg) => tg !== tag));
  };

  return (
    <>
      <div className="main-page">
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
                <AgeGroups
                  activeJourney={activeJourney}
                  setActiveJourney={setActiveJourney}
                  setActiveAgeClass={setActiveAgeClass}
                  isAllSelected={isAllSelected}
                  activeKey={activeKey}
                />
              </div>
              <div className="touchpoint-box">
                <div className="touchpoints-header">
                  <Category
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                    activeJourney={activeJourney}
                    isAllSelected={isAllSelected}
                  ></Category>
                </div>
                <div className="touchpoint-box-content">
                  <div className="touchpoint-box-inner">
                    <ActiveNarration
                      isInfoVisible={isInfoVisible}
                      expandNarrative={expandNarrative}
                      activeNarration={activeNarration}
                      isHcp={isHcp}
                      setExapandNarrative={setExapandNarrative}
                      setIsInfoVisible={setIsInfoVisible}
                    ></ActiveNarration>
                    <div className="box-inner">
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
                                    <span
                                      key={idx}
                                      className={
                                        "tag-item " +
                                        (tag.startsWith("prefix_")
                                          ? "f-tag"
                                          : "")
                                      }
                                    >
                                      {tag.replace("prefix_", "")}{" "}
                                      <button
                                        type="button"
                                        className="cross-btn"
                                        onClick={() => removeFilter(tag)}
                                      >
                                        <img
                                          src={path_image + "cross-arrow.svg"}
                                          alt=""
                                        />
                                      </button>
                                    </span>
                                  ))}
                              </div>
                            )}
                            <Form.Control
                              type="search"
                              aria-label="Search"
                              placeholder={"Search by tag or content title"}
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                              onKeyUp={handleSearchTextKeyUp}
                            />
                          </div>
                          <Button
                            variant="outline-success"
                            onClick={(e) => {
                              handleSearchClick(e);
                              if (searchText.length <= 3)
                                setToast({
                                  type: "danger",
                                  title: "Error",
                                  message:
                                    "Please enter at least three characters to search",
                                  show: true,
                                });
                            }}
                          >
                            <img
                              src={path_image + "search-icon.svg"}
                              alt="Search"
                            />
                          </Button>
                        </Form>
                      </div>
                      {content.loading ? (
                        <></>
                      ) : content.error ? (
                        <></>
                      ) : (
                        tags &&
                        tags.length > 0 && (
                          <div className="tags d-flex">
                            <div className="tag-title">Topics:</div>
                            <div className="tag-list d-flex">
                              {tags &&
                                (tagShowAllClicked
                                  ? tags
                                  : tags.slice(0, 10)
                                ).map((tag, idx) => {
                                  let cName = tag.startsWith("prefix_")
                                    ? "f-tag"
                                    : "n-tag";
                                  return (
                                    <div
                                      className={"tag-item" + " " + cName}
                                      key={idx}
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleTagClick(tag)}
                                    >
                                      {tag.replace("prefix_", "")}
                                    </div>
                                  );
                                })}
                              {tags && tags.length > 10 && (
                                <Button
                                  className={
                                    tagShowAllClicked
                                      ? "show-less-btn"
                                      : "show-more-btn"
                                  }
                                  // Add class "show-less-btn" show less tags
                                  onClick={() =>
                                    setTagShowAllClicked(!tagShowAllClicked)
                                  }
                                >
                                  <span>
                                    {tagShowAllClicked
                                      ? "Show less"
                                      : "Show more"}
                                  </span>
                                  <img
                                    src={`${path_image}right-arrow.svg`}
                                    alt="Show more"
                                    className="arrow-icon"
                                  />
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      )}
                      <div className="content-count-box">
                        <div className="content-count">
                          {content.loading ? (
                            <></>
                          ) : content.error ? (
                            <></>
                          ) : (
                            categoryTags &&
                            Object.keys(categoryTags).length > 1 &&
                            Object.keys(categoryTags)
                              .filter((cat) => cat.toLowerCase() !== "faq")
                              .map((cat, idx) => {
                                return (
                                  <div
                                    className={`filter ${
                                      contentCategory === cat ? "active" : ""
                                    }`}
                                    style={{
                                      cursor: "pointer",
                                      userSelect: "none",
                                    }}
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
                              })
                          )}
                        </div>
                        <div>
                          {content.loading ? (
                            <></>
                          ) : content.error ? (
                            <>
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
                            </>
                          ) : filteredContents &&
                            filteredContents.length > 0 ? (
                            <FixedSizeList
                              items={filteredContents}
                              itemCount={9}
                              favTab={isHcp}
                            />
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
                      </div>
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
