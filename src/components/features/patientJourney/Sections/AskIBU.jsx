import { useEffect, useState, useContext } from "react";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { fetchQuestions, handleSubmit } from "../../../../services/homeService";
import { ContentContext } from "../../../../context/ContentContext";
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
  const [questionData, setQuestionData] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Fetch questions
  useEffect(() => {
    (async () => {
      await fetchQuestions(setIsLoading, setQuestList);
    })();
  }, []);

  useEffect(() => {
    if (
      !questionList.loading &&
      !questionList.error &&
      questionList.questions &&
      questionList.questions.length > 0
    ) {
      setQuestionData(
        [...questionList.questions].sort(
          (a, b) =>
            new Date(b.created.replaceAll(".", " ")) -
            new Date(a.created.replaceAll(".", " "))
        )
      );
      let regionArr = [],
        countryArr = [],
        topicsArr = [];

      questionList.questions.forEach((item) => {
        regionArr.push(item.region);
        countryArr.push(item.country);
        topicsArr.push(...item.topics);
      });

      regionArr = [...new Set(regionArr)].filter((item) => item.trim() !== "");
      countryArr = [...new Set(countryArr)].filter(
        (item) => item.trim() !== ""
      );
      topicsArr = [...new Set(topicsArr)].filter((item) => item.trim() !== "");
      if (regionArr.includes("Other")) {
        regionArr = regionArr.filter((item) => item !== "Other").push("Other");
      }

      setRegions(regionArr);
      setCountries(countryArr);
      setTopics(topicsArr);
    }
  }, [questionList]);

  useEffect(() => {
    if (
      selectedRegions.length ||
      selectedCountries.length ||
      selectedTopics.length
    )
      filterQuestions();
    else
      setQuestionData(
        [...questionList.questions].sort(
          (a, b) =>
            new Date(b.created.replaceAll(".", " ")) -
            new Date(a.created.replaceAll(".", " "))
        )
      );
  }, [selectedRegions, selectedCountries, selectedTopics]);

  const filterQuestions = () => {
    const questionDataList = [...questionList.questions];
    let tempList = [];
    if (selectedCountries.length > 0) {
      const data = questionDataList.filter((item) =>
        selectedCountries.includes(item.country)
      );
      tempList = [...tempList, ...data];
    }
    if (selectedRegions.length > 0) {
      const data = questionDataList.filter((item) =>
        selectedRegions.includes(item.region)
      );
      tempList = [...tempList, ...data];
    }
    if (selectedTopics.length > 0) {
      const data = questionDataList.filter((item) => {
        if (item.topics) {
          for (let i = 0; i < item.topics.length; i++) {
            if (selectedTopics.includes(item.topics[i])) return true;
          }
          return false;
        } else return false;
      });
      tempList = [...tempList, ...data];
    }

    const uniqueQuestionList = {};
    tempList.forEach((item) => {
      uniqueQuestionList[item.id] = item;
    });

    tempList = Object.values(uniqueQuestionList);

    let countObj = {};
    tempList.forEach((item) => {
      let count = 0;
      if (selectedCountries.includes(item.country)) count++;
      if (selectedRegions.includes(item.region)) count++;
      item.topics.forEach((element) => {
        if (selectedTopics.includes(element)) count++;
      });
      countObj[item.id] = count;
    });

    let sortedKeys = Object.keys(countObj).sort(
      (a, b) => countObj[b] - countObj[a]
    );
    for (let i = 0; i < sortedKeys.length; i++) {
      sortedKeys[i] = parseInt(sortedKeys[i]);
    }

    let filteredItem = [];
    sortedKeys.forEach((itemId) => {
      tempList.forEach((quest) => {
        if (quest.id === itemId) filteredItem.push(quest);
      });
    });

    setQuestionData(filteredItem);
  };

  const toggleRegion = (region) => {
    if (selectedRegions.includes(region)) {
      const data = selectedRegions.filter((item) => item !== region);
      setSelectedRegions(data);
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      const data = selectedCountries.filter((item) => item !== country);
      setSelectedCountries(data);
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      const data = selectedTopics.filter((item) => item !== topic);
      setSelectedTopics(data);
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Remove all filters
  const clearAllFilters = () => {
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
          {(selectedRegions.length > 0 ||
            selectedCountries.length > 0 ||
            selectedTopics.length > 0) && (
            <div className="filter-list">
              <p className="label">Result:</p>
              {selectedRegions.length > 0 &&
                selectedRegions.map((region, index) => {
                  let count = 0;
                  questionData.forEach((item) => {
                    if (item.region === region) count++;
                  });
                  //questionData
                  return (
                    <span key={index} className="tag-item ">
                      {region} | <span>{count}</span>
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
                  );
                })}
              {selectedCountries.length > 0 &&
                selectedCountries.map((country, index) => {
                  let count = 0;
                  questionData.forEach((item) => {
                    if (item.country === country) count++;
                  });
                  return (
                    <span key={index} className="tag-item ">
                      {country} | <span>{count}</span>
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
                  );
                })}
              {selectedTopics.length > 0 &&
                selectedTopics.map((topic, index) => {
                  let count = 0;
                  questionData.forEach((item) => {
                    if (item.topics.includes(topic)) count++;
                  });
                  return (
                    <span key={index} className="tag-item ">
                      {topic} | <span>{count}</span>
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
                  );
                })}
              <button
                className="clear-all-btn btn btn-primary"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>
          )}
          <div className="filter-container">
            {(regions.length > 0 ||
              countries.length > 0 ||
              topics.length > 0) && (
              <button
                className="btn btn-link filter-btn"
                onClick={() => setShowFilterBox(!showFilterBox)}
              >
                {" "}
                Filter
                {selectedCountries.length +
                selectedRegions.length +
                selectedTopics.length ? (
                  <span className="filter-count">
                    {selectedCountries.length +
                      selectedRegions.length +
                      selectedTopics.length}{" "}
                  </span>
                ) : null}
                {showFilterBox ? (
                  <img src={path_image + "cross-btn.svg"} alt="Filter Icon" />
                ) : (
                  <img src={path_image + "filter.svg"} alt="Filter Icon" />
                )}
              </button>
            )}
          </div>
          {/* Filter dropdown */}
          {showFilterBox && (
            <div className="filter-box-overlay">
              <div className="filter-box">
                {/* Regions */}
                <div className="filter-group">
                  <label className="filter-label">Regions</label>
                  <div
                    className={`dropdown-toggle ${
                      showTagsDropdown === "regions" ? "active" : ""
                    }`}
                    onClick={() =>
                      setShowTagsDropdown(
                        showTagsDropdown === "regions" ? "" : "regions"
                      )
                    }
                  >
                    <span
                      className={`${selectedRegions.length ? "selected" : ""}`}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 11.2565C21 5.73362 16.5228 1.25647 11 1.25647C5.47715 1.25647 1 5.73362 1 11.2565C1 16.7793 5.47715 21.2565 11 21.2565C16.5228 21.2565 21 16.7793 21 11.2565Z"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M19 4.95546C18.0653 5.02283 16.8681 5.38471 16.0379 6.45924C14.5385 8.40008 13.039 8.56203 12.0394 7.91508C10.5399 6.94467 11.8 5.37283 10.0401 4.51862C8.89313 3.96189 8.73321 2.44692 9.37158 1.25647"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 10.2565C1.7625 10.9186 2.83046 11.5247 4.08874 11.5247C6.68843 11.5247 7.20837 12.0214 7.20837 14.0083C7.20837 15.9951 7.20837 15.9951 7.72831 17.4853C8.06651 18.4546 8.18472 19.4239 7.5106 20.2565"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12.7088C20.1129 12.1976 19 11.9873 17.8734 12.7969C15.7177 14.3463 14.2314 13.0625 13.5619 14.3454C12.5765 16.234 16.0957 16.8276 13 21.2565"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {selectedRegions.length
                        ? selectedRegions.join(", ")
                        : "Select region"}
                    </span>
                    <img
                      src={path_image + "arrow-down.svg"}
                      alt="toggle"
                      className={`arrow ${
                        showTagsDropdown === "regions" ? "open" : ""
                      }`}
                    />
                  </div>

                  {showTagsDropdown === "regions" && (
                    <div className="dropdown-list">
                      <div className="inner-scroll">
                        {regions.map((region, index) => (
                          <div
                            key={index}
                            className={`dropdown-option ${
                              selectedRegions.includes(region) ? "selected" : ""
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
                    </div>
                  )}
                </div>

                {/* Countries */}
                <div className="filter-group">
                  <label className="filter-label">Countries</label>
                  <div
                    className={`dropdown-toggle ${
                      showTagsDropdown === "countries" ? "active" : ""
                    }`}
                    onClick={() =>
                      setShowTagsDropdown(
                        showTagsDropdown === "countries" ? "" : "countries"
                      )
                    }
                  >
                    <span
                      className={`${
                        selectedCountries.length ? "selected" : ""
                      }`}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.08082 1.25647C4.47023 2.19237 1 6.26865 1 11.1554C1 16.7341 5.52238 21.2565 11.101 21.2565C15.9878 21.2565 20.0641 17.7862 21 13.1756"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17.9375 17.2565C18.3216 17.1731 18.6771 17.0405 19 16.8595M13.6875 16.5971C14.2831 16.858 14.8576 17.0513 15.4051 17.1783M9.85461 14.2042C10.2681 14.4945 10.71 14.8426 11.1403 15.1429M2 13.0814C2.32234 12.924 2.67031 12.7433 3.0625 12.5886M5.45105 12.2565C6.01293 12.3189 6.64301 12.4791 7.35743 12.7797"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 6.75647C17 5.92804 16.3284 5.25647 15.5 5.25647C14.6716 5.25647 14 5.92804 14 6.75647C14 7.5849 14.6716 8.25647 15.5 8.25647C16.3284 8.25647 17 7.5849 17 6.75647Z"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M16.488 12.8766C16.223 13.1203 15.8687 13.2565 15.5001 13.2565C15.1315 13.2565 14.7773 13.1203 14.5123 12.8766C12.0855 10.6321 8.83336 8.12462 10.4193 4.48427C11.2769 2.51596 13.3353 1.25647 15.5001 1.25647C17.6649 1.25647 19.7234 2.51596 20.5809 4.48427C22.1649 8.12003 18.9207 10.6398 16.488 12.8766Z"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                        />
                      </svg>
                      {selectedCountries.length
                        ? selectedCountries.join(", ")
                        : "Select country"}
                    </span>
                    <img
                      src={path_image + "arrow-down.svg"}
                      alt="toggle"
                      className={`arrow ${
                        showTagsDropdown === "countries" ? "open" : ""
                      }`}
                    />
                  </div>

                  {showTagsDropdown === "countries" && (
                    <div className="dropdown-list">
                      <div className="inner-scroll">
                        {countries.map((country, index) => (
                          <div
                            key={index}
                            className={`dropdown-option ${
                              selectedCountries.includes(country)
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
                    </div>
                  )}
                </div>

                {/* Topics */}
                <div className="filter-group">
                  <label className="filter-label">Topics</label>
                  <div
                    className={`dropdown-toggle topic ${
                      showTagsDropdown === "topics" ? "active" : ""
                    } `}
                    onClick={() =>
                      setShowTagsDropdown(
                        showTagsDropdown === "topics" ? "" : "topics"
                      )
                    }
                  >
                    <span
                      className={`${selectedTopics.length ? "selected" : ""}`}
                    >
                      <svg
                        width="18"
                        height="13"
                        viewBox="0 0 18 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.95833 5.625C9.41857 5.625 9.79167 5.9981 9.79167 6.45833C9.79167 6.91857 9.41857 7.29167 8.95833 7.29167H3.95833C3.4981 7.29167 3.125 6.91857 3.125 6.45833C3.125 5.9981 3.4981 5.625 3.95833 5.625H8.95833Z"
                          fill="#94A7BF"
                        />
                        <path
                          d="M13.9583 5.625C14.4186 5.625 14.7917 5.9981 14.7917 6.45833C14.7917 6.91857 14.4186 7.29167 13.9583 7.29167H12.2917C11.8314 7.29167 11.4583 6.91857 11.4583 6.45833C11.4583 5.9981 11.8314 5.625 12.2917 5.625H13.9583Z"
                          fill="#94A7BF"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13.125 0C15.7714 0 17.9167 2.1453 17.9167 4.79167V8.125C17.9167 10.7714 15.7714 12.9167 13.125 12.9167H4.79167C2.1453 12.9167 5.3688e-08 10.7714 0 8.125V4.79167C5.36898e-08 2.1453 2.1453 0 4.79167 0H13.125ZM4.79167 1.25C2.83566 1.25 1.25 2.83566 1.25 4.79167V8.125C1.25 10.081 2.83566 11.6667 4.79167 11.6667H13.125C15.081 11.6667 16.6667 10.081 16.6667 8.125V4.79167C16.6667 2.83566 15.081 1.25 13.125 1.25H4.79167Z"
                          fill="#94A7BF"
                        />
                      </svg>
                      {selectedTopics.length
                        ? selectedTopics.join(", ")
                        : "Select topic"}
                    </span>
                    <img
                      src={path_image + "arrow-down.svg"}
                      alt="toggle"
                      className={`arrow ${
                        showTagsDropdown === "topics" ? "open" : ""
                      }`}
                    />
                  </div>

                  {showTagsDropdown === "topics" && (
                    <div className="dropdown-list">
                      <div className="inner-scroll">
                        {topics.map((topic, index) => (
                          <div
                            key={index}
                            className={`dropdown-option ${
                              selectedTopics.includes(topic) ? "selected" : ""
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
            <></>
          ) : questionList.error ? (
            <></>
          ) : !questionData || questionData.length === 0 ? (
            <div className="no_data_found">No data Found</div>
          ) : (
            <AskIbuScroll
              items={questionData}
              itemCount={6}
              account={false}
              updateDeleteQuestion={() => {}}
            />
          )}
        </div>
      </div>

      {/* Ask question form */}
      {
        <Form className="ask-ibu-form">
          <FormGroup className={"form-group " + (error ? "error" : "")}>
            <Form.Label className="question-label">Your Question</Form.Label>
            <div className="question-textarea">
            <Form.Control
              id="question"
              as="textarea"
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question for IBU..."
            />
            </div>
            {error && <div className="validation">{error}</div>}
          </FormGroup>
          <div className="disclaimer-box">
            <p className="disclaimer">
              Please don&apos;t include any personal or confidential information
              in your question.
            </p>
         <button
           type="button"
           className={`submit-btn ${!question.trim() ? "disable" : ""}`}
           disabled={!question.trim()}
           onClick={(e) => {
           if (!question.trim()) {
           setError("Question is required");
           return;
           }
           handleSubmit(
           e,
           setError,
           question,
           setQuestion,
           setIsLoading,
           setToast,
           setShowConfirmationModal
          );
          }}
        >
         Submit <img src={path_image + "send-icon.svg"} alt="send" />
         </button>
          </div>
        </Form>
      }
      <div className="pop_up">
        <Modal
          show={showConfirmationModal}
          onHide={() => setShowConfirmationModal((prev) => !prev)}
          backdrop="static"
          keyboard={false}
          centered
          className="confirmation"
        >
          <Modal.Body>
            <div className="confirmation-card">
              <div className="check-icon">
                <img src={path_image + "check-icon-img.png"} alt="success" />
              </div>

              <h2 className="title">Question Sent</h2>
              <div className="description-box">
                <p className="description">
                  Your question has been successfully submitted!
                  <br />
                  You&apos;ll receive an email once IBU replies to your
                  question.
                </p>

                <p className="note">
                  You can also find all your submitted questions anytime in your
                  My Account page.
                </p>

                <Button
                  className="btn done"
                  type="button"
                  onClick={(e) => {
                    setShowConfirmationModal(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AskIBU;
