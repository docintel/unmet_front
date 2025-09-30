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
  const [journeyLabels, setJourneyLabels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [narrations, setNarrations] = useState([]);
  const [contentTags, setContentTags] = useState([]);
  const [currentReadClick, setCurrentReadClick] = useState({
    previewArticle: null,
    id: null,
  });
  const { content, setIsLoading } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [categoryTags, setCategoryTags] = useState();
  const [activeNarration, setActiveNarration] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { ageGroups, category, tags } = await fetchAgeGroupCategories();

      setJourneyLabels(ageGroups);
      setCategories(category);
      setContentTags(tags);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { narratives } = await fetchNarrativeList(isAllSelected ? 2 : 1);
      setNarrations(narratives);
      setActiveKey(null);
      setActiveJourney(null);
      setActiveNarration(null);
      setSearchText("");
      setIsLoading(false);
    })();
  }, [isAllSelected]);

  useEffect(() => {
    setActiveKey(null);
    setSearchText("");
  }, [activeJourney]);

  useEffect(() => {
    setSearchText("");
  }, [activeKey]);

  useEffect(() => {
    filterContents();
    if (activeKey && activeJourney) {
      const activeNarrative = narrations.find(
        (narration) =>
          narration.category_id == activeKey &&
          narration.age_group_id == activeJourney
      );
      if (activeNarrative) setActiveNarration(activeNarrative);
      else setActiveNarration(null);
    }
  }, [activeKey, activeJourney]);

  useEffect(() => {
    if (searchText.length == 0) handleSearchClick();
  }, [searchText]);

  const filterContents = () => {
    if (activeKey && activeJourney) {
      const categoryName = categories.find((val) => val.id == activeKey).name;
      const ageGroupName = journeyLabels
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
      setContents(filteredArray);
    } else if (activeKey) {
      const categoryName = categories.find((val) => val.id == activeKey).name;

      const filteredArray = [];
      content.map((item) => {
        if (
          item.diagnosis.indexOf(categoryName) != -1 &&
          item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1
        )
          filteredArray.push(item);
      });
      setContents(filteredArray);
    } else if (activeJourney) {
      const ageGroupName = journeyLabels
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
      setContents(filteredArray);
    } else if (searchText) {
      const filteredArray = [];
      content.map((item) => {
        if (item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1)
          filteredArray.push(item);
      });
      setContents(filteredArray);
    } else {
      setContents(content);
    }
  };

  const isTabDisabled = (cat_id) => {
    if (!activeJourney) return true;
    const narrative = narrations.find(
      (narration) =>
        narration.category_id == cat_id &&
        !["Not applicable", "Missing"].includes(narration.status)
    );
    return narrative ? false : true;
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

  const touchpointContent = [
    {
      ageTags: [
        { label: "Age 0-5", class: "age0" },
        { label: "Age 6-11", class: "age6" },
      ],
      format: "Video",
      heading:
        "Sebaga, diagnosed 7 years, VWD Type 3, many diagnosis difficultues",
      subheading: "Surviving the unknown - von Willebrand disease (VWD)",
      tags: ["awareness", "education", "providers", "HMB", "VWD"],
      date: "12.August.2025",
      likeArticle: "128",
    },
    {
      ageTags: [
        { label: "Age 18-25", class: "age18" },
        { label: "Age 26-60", class: "age26" },
      ],
      format: "Manuscript",
      heading:
        "Maria, living with VWD Type 1, diagnosed at 14, sharing her journey",
      subheading: "Breaking the silence – challenges and hope in managing VWD",
      tags: ["advocacy", "youth", "HMB", "bleedingdisorders", "support"],
      date: "03.September.2025",
      likeArticle: "256",
    },
    {
      ageTags: [{ label: "Age 6-11", class: "age6" }],
      format: "Slide deck",
      heading: "James & family – navigating childhood VWD Type 2",
      subheading:
        "A parent’s perspective on raising a child with von Willebrand disease",
      tags: ["parents", "family", "children", "education", "VWD"],
      date: "21.July.2025",
      likeArticle: "342",
    },
    {
      ageTags: [
        { label: "Age 26-60", class: "age26" },
        { label: "Age 60+", class: "age60" },
      ],
      format: "Video",
      heading: "Dr. Lee – improving early detection of von Willebrand disease",
      subheading: "Why awareness among providers can change patient outcomes",
      tags: ["awareness", "education", "providers", "diagnosis", "research"],
      date: "29.June.2025",
      likeArticle: "415",
    },
  ];

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
                  {journeyLabels &&
                    journeyLabels.map((lbl) => (
                      <React.Fragment key={lbl.id}>
                        <div
                          key={lbl.id}
                          className={`journey-link ${
                            activeJourney === lbl.id ? "active" : ""
                          }`}
                          // dangerouslySetInnerHTML={{ __html: label }}
                          onClick={() => setActiveJourney(lbl.id)}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: lbl.label,
                            }}
                          ></div>
                        </div>
                        {lbl.id !== journeyLabels.length + 1 && (
                          <div className="line"></div>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
              <div className="touchpoint-box">
                <div className="touchpoints-header">
                  <Tabs
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k)}
                    fill
                  >
                    {/* to see the original layout please comment and uncomment the the uncommented and commented below code */}

                    {categories &&
                      categories.map((cat) => {
                        return (
                          <Tab
                            key={cat.id}
                            eventKey={cat.id}
                            title={cat.name}
                            disabled={isTabDisabled(cat.id)}
                            className={isTabDisabled(cat.id) ? "disabled" : ""}
                          >
                            {activeJourney && activeKey && activeNarration && (
                              <div className="touchpoint-data">
                                <h6>Short Narrative</h6>
                                <div className="d-flex justify-content-between narrative-block">
                                  <div className="content">
                                    <p>{activeNarration.narrative_title}</p>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          activeNarration.narrative_description,
                                      }}
                                    ></div>
                                  </div>
                                  <div className="content">
                                    <p>{activeNarration.contibution_title}</p>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          activeNarration.contibution_description,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Tab>
                        );
                      })}
                  </Tabs>

                  {/* Default message when no tab is selected */}
                  {(!activeJourney || !activeKey) && (
                    <div className="text-center no_data">
                      Choose the patient’s age and touchpoint from the options
                      above
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
                <div className="tags d-flex">
                  <div className="tag-title">Tags:</div>
                  <div className="tag-list d-flex">
                    {contentTags &&
                      contentTags.map((tag, idx) => (
                        <div className="tag-item" key={idx}>
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
