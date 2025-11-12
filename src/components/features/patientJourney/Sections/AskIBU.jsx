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
import { useLocation } from "react-router-dom";
import { ContentContext } from "../../../../context/ContentContext";
import QuestionCard from "../Common/QuestionCard";
import { countryRegionArray } from "../../../../constants/countryRegion";

const AskIBU = () =>
{
  const questionData = [
    {
      question: "What is artificial intelligence?",
      region: "North America",
      country: "USA",
      answer:
        "Artificial intelligence is the simulation of human intelligence processes by machines.",
      tags: ["AI", "technology", "innovation"],
      date: "2025-01-05",
    },
    {
      question: "How does blockchain work?",
      region: "Europe",
      country: "Germany",
      answer:
        "Blockchain is a distributed ledger technology that stores data in blocks linked together in a chain.",
      tags: ["blockchain", "crypto", "data"],
      date: "2025-01-10",
    },
    {
      question: "What are renewable energy sources?",
      region: "Asia",
      country: "India",
      answer:
        "Renewable energy sources include solar, wind, hydro, and geothermal energy.",
      tags: ["energy", "sustainability", "environment"],
      date: "2025-01-12",
    },
    {
      question: "What is the purpose of cloud computing?",
      region: "Oceania",
      country: "Australia",
      answer:
        "Cloud computing allows users to store and access data and applications over the internet.",
      tags: ["cloud", "storage", "computing"],
      date: "2025-01-15",
    },
    {
      question: "How does machine learning differ from AI?",
      region: "North America",
      country: "Canada",
      answer:
        "Machine learning is a subset of AI focused on enabling systems to learn from data automatically.",
      tags: ["AI", "ML", "data"],
      date: "2025-01-18",
    },
    {
      question: "What are the benefits of remote work?",
      region: "Europe",
      country: "France",
      answer:
        "Remote work increases flexibility, productivity, and work-life balance for employees.",
      tags: ["work", "remote", "productivity"],
      date: "2025-01-21",
    },
    {
      question: "What is cybersecurity?",
      region: "Asia",
      country: "Japan",
      answer:
        "Cybersecurity is the practice of protecting systems and networks from digital attacks.",
      tags: ["security", "IT", "cyber"],
      date: "2025-01-25",
    },
    {
      question: "What is data visualization?",
      region: "South America",
      country: "Brazil",
      answer:
        "Data visualization represents data graphically to identify trends, patterns, and insights.",
      tags: ["data", "charts", "visualization"],
      date: "2025-02-01",
    },
    {
      question: "How do electric vehicles help the environment?",
      region: "Europe",
      country: "Norway",
      answer:
        "Electric vehicles reduce greenhouse gas emissions and reliance on fossil fuels.",
      tags: ["EV", "environment", "transport"],
      date: "2025-02-03",
    },
    {
      question: "What is the Internet of Things (IoT)?",
      region: "Asia",
      country: "Singapore",
      answer:
        "IoT refers to interconnected devices that communicate and exchange data over the internet.",
      tags: ["IoT", "devices", "technology"],
      date: "2025-02-06",
    },
    {
      question: "What are the advantages of 5G networks?",
      region: "North America",
      country: "USA",
      answer:
        "5G networks provide faster speeds, lower latency, and improved connectivity for smart devices.",
      tags: ["5G", "network", "connectivity"],
      date: "2025-02-10",
    },
    {
      question: "What is edge computing?",
      region: "Europe",
      country: "Sweden",
      answer:
        "Edge computing processes data closer to its source to reduce latency and bandwidth usage.",
      tags: ["computing", "data", "IoT"],
      date: "2025-02-14",
    },
    {
      question: "What are quantum computers?",
      region: "Asia",
      country: "China",
      answer:
        "Quantum computers use qubits to perform calculations faster than classical computers.",
      tags: ["quantum", "computing", "technology"],
      date: "2025-02-18",
    },
    {
      question: "What is big data?",
      region: "North America",
      country: "Mexico",
      answer:
        "Big data refers to extremely large data sets that require advanced tools for analysis.",
      tags: ["data", "analytics", "tech"],
      date: "2025-02-21",
    },
    {
      question: "What is augmented reality?",
      region: "Europe",
      country: "Italy",
      answer:
        "Augmented reality overlays digital information onto the real world using devices like smartphones.",
      tags: ["AR", "tech", "visual"],
      date: "2025-02-25",
    },
    {
      question: "How does virtual reality work?",
      region: "Asia",
      country: "South Korea",
      answer:
        "Virtual reality immerses users in a simulated 3D environment using headsets and sensors.",
      tags: ["VR", "simulation", "tech"],
      date: "2025-03-01",
    },
    {
      question: "What is the purpose of UI/UX design?",
      region: "Europe",
      country: "Spain",
      answer:
        "UI/UX design ensures digital interfaces are visually appealing and easy to use.",
      tags: ["design", "UI", "UX"],
      date: "2025-03-05",
    },
    {
      question: "How does responsive web design work?",
      region: "Asia",
      country: "India",
      answer:
        "Responsive design ensures websites adapt to different screen sizes and devices.",
      tags: ["web", "design", "frontend"],
      date: "2025-03-08",
    },
    {
      question: "What is the function of APIs?",
      region: "North America",
      country: "USA",
      answer:
        "APIs allow software applications to communicate and share data seamlessly.",
      tags: ["API", "integration", "development"],
      date: "2025-03-12",
    },
    {
      question: "What is digital transformation?",
      region: "Europe",
      country: "UK",
      answer:
        "Digital transformation integrates digital technology into all areas of business operations.",
      tags: ["business", "digital", "innovation"],
      date: "2025-03-15",
    },
  ];
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
  }, []);

  const toggleRegion = (region) =>
  {
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
          {questionData.map((question, index) =>
          {
            return (
              <QuestionCard question={question} key={index} account={false} />
            );
          })}
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
