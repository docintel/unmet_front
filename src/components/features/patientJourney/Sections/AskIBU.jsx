import React, { useEffect, useState, useContext } from "react";
import { Form, FormGroup, Dropdown } from "react-bootstrap";
import
{
  fetchQuestions,
  handleSubmit,
  fetchTags,
  filterQuestionsByTags,
  fetchYourQuestions,
} from "../../../../services/homeService";
import { ContentContext } from "../../../../context/ContentContext";
import { countryRegionArray } from "../../../../constants/countryRegion";
import AskIbuScroll from "../Common/AskIbuScroll";

const AskIBU = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { setToast } = useContext(ContentContext);
  const { setIsLoading } = useContext(ContentContext);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [questionList, setQuestList] = useState({
    loading: false,
    error: false,
    questions: [],
  });
  const [questionData,setQuestionData] = useState([])

  // Fetch questions
  useEffect(() =>
  {
    let regionArr = [];
    Object.values(countryRegionArray)
      .filter((item) => item.toLowerCase !== "other")
      .forEach((element) =>
      {
        if (!regionArr.includes(element)) regionArr = [...regionArr, element];
      });
    setRegions([...regionArr, "Other"]);
    setCountries(Object.keys(countryRegionArray));
    setTopics(["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"]);
    (async()=>{
      const ibuQuestions = await fetchQuestions(setIsLoading,setQuestList);
      console.log(ibuQuestions)
    })()
  }, []);

  useEffect(() => {
    if (
      !questionList.loading &&
      !questionList.error &&
      questionList.questions &&
      questionList.questions.length > 0
    ) {
      setQuestionData(questionList.questions);
      let regionArr = [],
        countryArr = [],
        topicsArr = [];
      

      questionList.questions.forEach((item) => {
        regionArr.push(item.region);
        countryArr.push(item.country);
        topicsArr.push(...item.topics);
      });

      regionArr = [...new Set(regionArr)];
      countryArr = [...new Set(countryArr)];
      topicsArr = [...new Set(topicsArr)];
      if (regionArr.includes("Other")) {
        regionArr = regionArr
          .filter((item) => item !== "Other")
          .push("Other");
      }

      setRegions(regionArr)
      setCountries(countryArr)
      setTopics(topicsArr)
    }
  }, [questionList]);

  useEffect(() => {
    let data = [...questionList.questions];
    if (selectedCountries.length > 0) {
      data = data.filter((item) => selectedCountries.includes(item.country));
    }
    if (selectedRegions.length > 0) {
      data = data.filter((item) => selectedRegions.includes(item.region));
    }
    if (selectedTopics.length > 0) {
      data = data.filter((item) => {
        if (item.topics) {
          for (let i = 0; i < item.topics.length; i++) {
            if (selectedTopics.includes(item.topics[i])) return true;
          }
          return false;
        } else return false;
      });
    }
    setQuestionData(data);
  }, [selectedRegions, selectedCountries, selectedTopics]);

  const toggleRegion = (region) => {
    if (selectedRegions.includes(region)) {
      const data = selectedRegions.filter((item) => item !== region);
      setSelectedRegions(data);
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const toggleCountry = (country) =>
  {
    if (selectedCountries.includes(country)) {
      const data = selectedCountries.filter((item) => item !== country);
      setSelectedCountries(data);
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const toggleTopic = (topic) =>
  {
    if (selectedTopics.includes(topic)) {
      const data = selectedTopics.filter((item) => item !== topic);
      setSelectedTopics(data);
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Remove all filters
  const clearAllFilters = () =>
  {
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedTopics([]);
  };

  return (
    <>
      {/* Filter button */}
      <div className="ask-ibu-filter">
        {/* Applied filters */}
        <div className="filter-section">
          {(selectedRegions.length > 0 || selectedCountries.length > 0 || selectedTopics.length > 0) && <div className="filter-list">
            <p className="label">Result ( 17 ) :</p>
            {selectedRegions.length > 0 && (
              selectedRegions.map((region, index) => (
                <span key={index} className="tag-item ">
                  {region}{" "}
                  <button
                    className="cross-btn"
                    onClick={() => toggleRegion(region)}
                  >
                    <img
                      src={path_image + "cross-arrow.svg"}
                      alt="delete"
                    />
                  </button>
                </span>
              ))
            )}
            {selectedCountries.length > 0 && (
              selectedCountries.map((country, index) => (
                <span key={index} className="tag-item ">
                  {country}{" "}
                  <button
                    className="cross-btn"
                    onClick={() => toggleCountry(country)}
                  >
                    <img
                      src={path_image + "cross-arrow.svg"}
                      alt="delete"
                    />
                  </button>
                </span>
              ))
            )}
            {selectedTopics.length > 0 && (

              selectedTopics.map((topic, index) => (
                <span key={index} className="tag-item ">
                  {topic}{" "}
                  <button
                    className="cross-btn"
                    onClick={() => toggleTopic(topic)}
                  >
                    <img
                      src={path_image + "cross-arrow.svg"}
                      alt="delete"
                    />
                  </button>
                </span>
              ))

            )}
            <button
              className="clear-all-btn btn btn-primary"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </div>
          }
          <div className="filter-container">
            <button
              className="btn btn-link filter-btn"
              onClick={() => setShowFilterBox(!showFilterBox)}
            >
              {" "}
              Filter
              {/* <span className="filter-count">3</span> */}
              {showFilterBox ? (
                <img src={path_image + "cross-btn.svg"} alt="Filter Icon" />
              ) : (
                <img src={path_image + "filter.svg"} alt="Filter Icon" />
              )}
            </button>
          </div>
          {/* Filter dropdown */}
          {showFilterBox && (
            <div className="filter-box-overlay">
              <div className="filter-box">
                {/* Regions */}
                <div className="filter-group">
                  <label className="filter-label">Regions</label>
                  <div
                    className="dropdown-toggle"
                    onClick={() =>
                      setShowTagsDropdown(
                        showTagsDropdown === "regions" ? "" : "regions"
                      )
                    }
                  >
                    <span>
                      <img src={path_image + "region-icon.svg"} alt="" />
                      Select region
                    </span>
                    <img
                      src={path_image + "arrow-down.svg"}
                      alt="toggle"
                      className={`arrow ${showTagsDropdown === "regions" ? "open" : ""
                        }`}
                    />
                  </div>

                  {showTagsDropdown === "regions" && (
                    <div className="dropdown-list">
                      {regions.map((region, index) => (
                        <div
                          key={index}
                          className={`dropdown-option ${selectedRegions.includes(region) ? "selected" : ""
                            }`}
                          onClick={() => toggleRegion(region)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes(region)}
                            readOnly
                          />
                          <span>{region}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Countries */}
                <div className="filter-group">
                  <label className="filter-label">Countries</label>
                  <div
                    className="dropdown-toggle"
                    onClick={() =>
                      setShowTagsDropdown(
                        showTagsDropdown === "countries" ? "" : "countries"
                      )
                    }
                  >
                    <span>
                      <img src={path_image + "country-icon.svg"} alt="" />
                      Select country
                    </span>
                    <img
                      src={path_image + "arrow-down.svg"}
                      alt="toggle"
                      className={`arrow ${showTagsDropdown === "countries" ? "open" : ""
                        }`}
                    />
                  </div>

                  {showTagsDropdown === "countries" && (
                    <div className="dropdown-list">
                      {countries.map((country, index) => (
                        <div
                          key={index}
                          className={`dropdown-option ${selectedCountries.includes(country)
                            ? "selected"
                            : ""
                            }`}
                          onClick={() => toggleCountry(country)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCountries.includes(country)}
                            readOnly
                          />
                          <span>{country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Topics */}
                <div className="filter-group">
                  <label className="filter-label">Topics</label>
                  <div
                    className="dropdown-toggle"
                    onClick={() =>
                      setShowTagsDropdown(
                        showTagsDropdown === "topics" ? "" : "topics"
                      )
                    }
                  >
                    <span>
                      <img src={path_image + "topics-icon.svg"} alt="" />
                      Select topic
                    </span>
                    <img
                      src={path_image + "arrow-down.svg"}
                      alt="toggle"
                      className={`arrow ${showTagsDropdown === "topics" ? "open" : ""
                        }`}
                    />
                  </div>

                  {showTagsDropdown === "topics" && (
                    <div className="dropdown-list">
                      {topics.map((topic, index) => (
                        <div
                          key={index}
                          className={`dropdown-option ${selectedTopics.includes(topic) ? "selected" : ""
                            }`}
                          onClick={() => toggleTopic(topic)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            readOnly
                          />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Questions list */}
        <div className="scroll-list">
          {questionList.loading ? (
            <>Loading...</>
          ) : questionList.error ? (
            <>Error...</>
          ) : !questionData || questionData.length === 0 ? (
            <>No data</>
          ) : (
            <AskIbuScroll items={questionData} itemCount={6} account={false}/>
          )}
        </div>
      </div>

      {/* Ask question form */}
      {
        <Form
          className="ask-ibu-form"
          onSubmit={(e) =>
            handleSubmit(
              e,
              setError,
              question,
              setQuestion,
              setIsLoading,
              setToast
            )
          }
        >
          <FormGroup className="form-group">
            <Form.Label className="question-label">Your Question</Form.Label>
            <Form.Control
              id="question"
              as="textarea"
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question for IBU..."
            />
            {error && <div className="validation">{error}</div>}
          </FormGroup>
          <div className="disclaimer-box">
            <p className="disclaimer">
              Please don’t include any personal or confidential information in
              your question.
            </p>
            <button type="submit" className="submit-btn">
              Submit <img src={path_image + "send-icon.svg"} alt="send" />
            </button>
          </div>
        </Form>
      }
    </>
  );
};

export default AskIBU;
