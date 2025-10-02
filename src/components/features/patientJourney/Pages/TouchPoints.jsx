import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Row, Tab, Tabs } from "react-bootstrap";

import Content from "../Common/Content";
import {
  fetchAgeGroupCategories,
  fetchNarrativeList,
} from "../../../../services/touchPointServices";
import { ContentContext } from "../../../../context/ContentContext";
import { toast } from "react-toastify";

const TouchPoints = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [isAllSelected, setIsAllSelected] = useState(false);
  const toggleUserType = () => setIsAllSelected((prev) => !prev);
  const [activeKey, setActiveKey] = useState(null); // no tab selected initially
  const [activeJourney, setActiveJourney] = useState(null); // no journey selected initially

  const [currentReadClick, setCurrentReadClick] = useState({
    previewArticle: null,
    id: null,
  });
  const {
    content,
    filterAges,
    filterTag,
    filterCategory,
    narrative,
    fetchAgeGroups,
    getNarratives,
  } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [categoryTags, setCategoryTags] = useState();
  const [activeNarration, setActiveNarration] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    (async () => {
      await fetchAgeGroups();
    })();
  }, []);

  useEffect(() => {
    if (filterTag.length > 0) setTags([...filterTag].sort());
  }, [filterTag]);

  useEffect(() => {
    (async () => {
      await getNarratives(isAllSelected ? 2 : 1);
      setActiveKey(null);
      setActiveJourney(null);
      setActiveNarration(null);
      setSearchText("");
    })();
  }, [isAllSelected]);

  useEffect(() => {
    setSearchText("");
  }, [activeJourney]);

  useEffect(() => {
    setSearchText("");
  }, [activeKey]);

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
    } else if (activeKey) {
      const activeNarrative = narrative.filter(
        (narration) =>
          narration.category_id == activeKey &&
          !["Not applicable"].includes(narration.status)
      );
      if (activeNarrative.length > 0)
        setActiveNarration([...activeNarrative].sort((a, b) => a.id - b.id)[0]);
      else setActiveNarration(null);
    } else if (activeJourney) {
      const activeNarratives = narrative.filter(
        (narration) =>
          narration.age_group_id == activeJourney &&
          !["Not applicable"].includes(narration.status)
      );

      if (activeNarratives.length > 0) {
        const leastIdNarration = activeNarratives.sort(
          (a, b) => a.id - b.id
        )[0];
        setActiveNarration(leastIdNarration);
      } else setActiveNarration(null);
    } else setActiveNarration(null);
  }, [activeKey, activeJourney]);

  useEffect(() => {
    if (searchText.length == 0) handleSearchClick();
  }, [searchText]);

  const filterContents = () => {
    if (activeKey && activeJourney) {
      const categoryName = filterCategory.find(
        (val) => val.id == activeKey
      ).name;
      const ageGroupName = filterAges
        .find((val) => val.id == activeJourney)
        .label.split("<br />")[1];

      const filteredArray = [];
      content.map((item) => {
        if (
          item.age_groups.indexOf(ageGroupName) != -1 &&
          item.diagnosis.indexOf(categoryName) != -1 &&
          item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1
        )
          filteredArray.push(item);
      });
      const newArr =
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
    } else if (activeKey) {
      const categoryName = filterCategory.find(
        (val) => val.id == activeKey
      ).name;

      const filteredArray = [];
      content.map((item) => {
        if (
          item.diagnosis.indexOf(categoryName) != -1 &&
          item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1
        )
          filteredArray.push(item);
      });
      const newArr =
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
    } else if (activeJourney) {
      const ageGroupName = filterAges
        .find((val) => val.id == activeJourney)
        .label.split("<br />")[1];

      const filteredArray = [];
      content.map((item) => {
        if (
          item.age_groups.indexOf(ageGroupName) != -1 &&
          item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1
        )
          filteredArray.push(item);
      });

      const newArr =
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
    } else if (searchText) {
      const filteredArray = [];
      content.map((item) => {
        if (item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1)
          filteredArray.push(item);
      });

      const newArr =
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
    } else {
      if (content && content.length > 0) {
        const newArr =
          selectedTag.length === 0
            ? content
            : content.filter((item) => {
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
      } else {
        setContents(content);
      }
    }
  };

  const isTabDisabled = (cat_id, isTab) => {
    if (isTab) {
      if (activeJourney) {
        const nrtv = narrative.find(
          (narration) =>
            narration.category_id == cat_id &&
            narration.age_group_id == activeJourney &&
            !["Not applicable"].includes(narration.status)
        );
        return nrtv ? false : true;
      } else return false;
    } else {
      if (activeKey) {
        if (
          (activeKey == 4 && [2, 3, 7].includes(cat_id)) ||
          (activeKey == 6 && [2, 3].includes(cat_id))
        )
          return true;
        else return false;
      } else return false;
    }
  };

  useEffect(() => {
    setContents(content);
    filterContents();
    if (content) getCategoryTags(content);
  }, [content]);

  const getCategoryTags = (content) => {
    const CategoryCount = { all: content.length };
    content.map((cntnt) => {
      CategoryCount[cntnt.category] = (CategoryCount[cntnt.category] || 0) + 1;
    });

    setCategoryTags(CategoryCount);
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

  useEffect(() => {
    filterContents();
  }, [selectedTag]);

  return (
    <>
      <div className="main-page">
        {" "}
        <div className="custom-container">
          <Row>
            <div className="touchpoints-section">
              <div className="patient-journey d-flex align-items-center w-100">
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
                <div className="journey-link-list d-flex align-items-center justify-content-between w-100">
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
                              if (activeJourney !== lbl.id)
                                setActiveJourney(lbl.id);
                              else setActiveJourney(null);
                            }
                          }}
                        >
                          <div
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
                          >
                            {cat.name}
                          </Button>
                        );
                      })}
                  </div>

                  {activeNarration ? (
                    <div className="touchpoint-data">
                      <h6>Short Narrative</h6>
                      <div className="d-flex justify-content-between narrative-block">
                        <div className="content">
                          <p>{activeNarration.narrative_title}</p>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: activeNarration.narrative_description,
                            }}
                          ></div>
                        </div>
                        <div className="content">
                          <p>{activeNarration.contibution_title}</p>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: activeNarration.contibution_description,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center no_data">
                      Choose the patient&apos;s age and touchpoint from the
                      options above
                      <br />
                      to access content tailored to their unmet needs.
                    </div>
                  )}
                </div>
                <div className="search-bar">
                  <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                    <Form.Control
                      type="search"
                      aria-label="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyUp={handleSearchTextKeyUp}
                    />
                    <Button
                      variant="outline-success"
                      onClick={handleSearchClick}
                    >
                      <img src={path_image + "search-icon.svg"} alt="Search" />
                    </Button>
                  </Form>
                </div>
                {selectedTag.length > 0 && (
                  <div className="tags d-flex">
                    <div className="tag-title">Selected Tags:</div>
                    <div className="tag-list d-flex">
                      {selectedTag &&
                        selectedTag.map((tag, idx) => (
                          <span key={idx} className="badge bg-info me-2">
                            {tag}{" "}
                            <button
                              className="btn btn-sm btn-light ms-1"
                              onClick={() => removeFilter(tag)}
                            >
                              ✖
                            </button>
                          </span>
                        ))}
                    </div>
                  </div>
                )}
                <div className="tags d-flex">
                  <div className="tag-title">Tags:</div>
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
                  </div>
                </div>
                <div className="content-count-box">
                  <div className="content-count">
                    {categoryTags &&
                      Object.keys(categoryTags).map((cat, idx) => {
                        return (
                          <div
                            className={cat.toLowerCase() == "all" ? "all" : ""}
                            key={idx}
                          >
                            {cat}
                            <br />
                            {categoryTags[cat]}
                          </div>
                        );
                      })}
                  </div>
                  <div className="touchpoint-data-boxes">
                    {" "}
                    {contents && contents.length > 0 ? (
                      contents &&
                      contents.map((section, idx) => (
                        <React.Fragment key={section.id}>
                          <Content
                            section={section}
                            idx={section.id}
                            key={idx}
                            currentReadClick={currentReadClick}
                            setCurrentReadClick={setCurrentReadClick}
                          />
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="no-data-found">No data Found</div>
                    )}
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
