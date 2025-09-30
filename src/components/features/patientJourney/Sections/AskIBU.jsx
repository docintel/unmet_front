import React, { useEffect, useState,useContext } from "react";
import { Form, FormGroup, Dropdown } from "react-bootstrap";
import {
  fetchQuestions,
  handleSubmit,
  fetchTags,
  filterQuestionsByTags,
  fetchYourQuestions,
} from "../../../../services/homeService";
import { useLocation } from "react-router-dom";
import { ContentContext } from "../../../../context/ContentContext";

const AskIBU = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [askIbu, setAskIbu] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const { setIsLoading } = useContext(ContentContext);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [yourQuestion, setYourQuestion] = useState([]);
  const location = useLocation();

  // Fetch questions
  useEffect(() => {
    if (location.pathname === "/account") return;
    const fetchData = async () => {
      const data = await fetchQuestions(setIsLoading);
      if (data) {
        setAskIbu(data);
        setFilteredQuestions(data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname === "/home") return;
    const fetchData = async () => {
      const data = await fetchYourQuestions(setIsLoading);
      if (data) {
        setYourQuestion(data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Fetch tags
  useEffect(() => {
    if (location.pathname === "/account") return;
    const loadTags = async () => {
      const data = await fetchTags(setIsLoading);
      if (data) setTags(data);
      setIsLoading(false);
    };
    loadTags();
  }, []);

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Apply filter
  const applyFilter = () => {
    if (selectedTags.length > 0) {
      setAppliedFilters(selectedTags);
      setFilteredQuestions(filterQuestionsByTags(askIbu, selectedTags));
    } else {
      setAppliedFilters([]);
      setFilteredQuestions(askIbu);
    }
    setShowFilterBox(false);
  };

  // Cancel filter
  const cancelFilter = () => {
    setSelectedTags([]);
    setShowFilterBox(false);
  };

  // Remove single filter
  const removeFilter = (tag) => {
    const updated = appliedFilters.filter((t) => t !== tag);
    setAppliedFilters(updated);
    setFilteredQuestions(filterQuestionsByTags(askIbu, updated));
    setSelectedTags(updated);
  };

  // Remove all filters
  const clearAllFilters = () => {
    setAppliedFilters([]);
    setSelectedTags([]);
    setFilteredQuestions(askIbu);
  };

  const dataToMap =
    location.pathname === "/account" ? yourQuestion : filteredQuestions;


  return (
    <>
      {/* Filter button */}
      {location.pathname !== "/account" && (
        <div className="filter-section">
          <div className="filter-container">
            <button
              className="btn btn-link filter-btn"
              onClick={() => setShowFilterBox(!showFilterBox)}
            >
              {showFilterBox ? <img src={path_image + "close-arrow.svg"} alt="Filter Icon" /> : <img src={path_image + "filter-icon.svg"} alt="Filter Icon" />}
            </button>
          </div>

          {/* Filter dropdown */}
          {showFilterBox && (
            <div className="filter-box">
              <h6>Filter:</h6>
              {/* Tags Dropdown Toggle */}
              <button
                className="btn btn-light w-100 text-start"
                onClick={() => setShowTagsDropdown(!showTagsDropdown)}
              >
                Tags
                <span className="float-end">
                  {showTagsDropdown ? "▲" : "▼"}
                </span>
              </button>

              {/* Tags options */}
              {showTagsDropdown && (
                <div
                  className="tags-options"
                >
                  <div className="tags-list">
                  {tags.map((tag, index) => (
                    <div key={index} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`tag-${index}`}
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`tag-${index}`}
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                  </div>
                </div>
              )}

              <div className="mt-2 d-flex justify-content-between">
                <button className="btn btn-primary" onClick={applyFilter}>
                  Apply
                </button>
                <button className="btn btn-primary btn-bordered" onClick={cancelFilter}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Applied filters */}
          {appliedFilters.length > 0 && (
            <div className="applied-filters mb-3">
              {appliedFilters.map((tag, index) => (
                <span key={index} className="badge bg-info me-2">
                  {tag}{" "}
                  <button
                    className="btn btn-sm btn-light ms-1"
                    onClick={() => removeFilter(tag)}
                  >
                    ✖
                  </button>
                </span>
              ))}
              <button
                className="btn btn-link text-danger ms-2"
                onClick={clearAllFilters}
              >
                Remove All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Questions list */}
      <div className="scroll-list">
        {dataToMap.length > 0 ? (dataToMap.map((item) => (
          <div className="detail-data-box" key={item.id}>
            <div className="content-box">
              <div className="heading">{item.question}</div>
              <div className="region">{item.country}</div>
              <div className="tags">
                {item.topics.map((tag, idx) => (
                  <div key={idx}>{tag}</div>
                ))}
              </div>
              <div className="answer">
                <span>Answer:</span>
                {item.answer}
              </div>
              <div className="date">{item.created}</div>
            </div>
          </div>
        ))): <div className="no-data-found">No data Found</div> }
      </div>

      {/* Ask question form */}
      {location.pathname !== "/account" && (
        <Form
          className="ask-ibu-form"
          onSubmit={(e) => handleSubmit(e, setError, question, setQuestion,setIsLoading)}
        >
          <FormGroup className="form-group">
            <Form.Control
              id="question"
              as="textarea"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question..."
            />
            {error && <div className="validation text-danger">{error}</div>}
          </FormGroup>
          <button type="submit" className="btn btn-primary mt-2">
            Send
          </button>
        </Form>
      )}
    </>
  );
};

export default AskIBU;
