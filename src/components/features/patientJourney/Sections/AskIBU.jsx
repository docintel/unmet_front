// import React, { useEffect, useState } from "react";
// import { Form, FormGroup } from "react-bootstrap";
// import { fetchQuestions } from "../../../../services/homeService";
// import { handleSubmit } from "../../../../services/homeService";

// const AskIBU = () => {
//   const [askIbu, setAskIbu] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [question, setQuestion] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await fetchQuestions(setLoading);
//       if (data) {
//         setAskIbu(data);
//       }
//     };

//     fetchData();
//   }, [question]);


//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <>
//       <div className="scroll-list">
//         {askIbu.map((item) => (
//           <div className="detail-data-box" key={item.id}>
//             <div className="content-box">
//               <div className="heading">{item.question}</div>
//               <div className="region">{item.country}</div>
//               <div className="tags">
//                 {item.topics.map((tag, idx) => (
//                   <div key={idx}>{tag}</div>
//                 ))}
//               </div>
//               <div className="answer">
//                 <span>Answer:</span>
//                 {item.answer}
//               </div>
//               <div className="date">{item.created}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <Form className="ask-ibu-form" onSubmit={(e) => handleSubmit(e, setError, question, setQuestion)}>
//         <FormGroup className="form-group">
//            <Form.Control id="question" as="textarea" rows={4} value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             placeholder=""/>
//           {/* <textarea
//             className="form-control"
//             id="question"
//             rows="4"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             placeholder=""
//           ></textarea> */}
//           {error && <div className="validation">{error}</div>}
//         </FormGroup>
//         <button type="submit" className="btn btn-primary">
//           Send
//         </button>
//       </Form>
//     </>
//   );
// };

// export default AskIBU;



import React, { useEffect, useState } from "react";
import { Form, FormGroup, Dropdown } from "react-bootstrap";
import {
  fetchQuestions,
  handleSubmit,
  fetchTags,
  filterQuestionsByTag,
} from "../../../../services/homeService";

const AskIBU = () => {
  const [askIbu, setAskIbu] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // Fetch questions
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchQuestions(setLoading);
      if (data) {
        setAskIbu(data);
        setFilteredQuestions(data);
      }
    };
    fetchData();
  }, [question]);

  // Fetch tags
  useEffect(() => {
    const loadTags = async () => {
      const data = await fetchTags();
      if (data) setTags(data);
    };
    loadTags();
  }, []);

  // Handle filter
  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    setFilteredQuestions(filterQuestionsByTag(askIbu, tag));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="filter-container">
        <button
          className="filter-btn"
          onClick={() => setShowFilter(!showFilter)}
        >
          <i className="bi bi-funnel"></i>
        </button>

        {showFilter && (
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {selectedTag || "All Tags"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleTagFilter(null)}>
                All
              </Dropdown.Item>
              {tags.map((tag) => (
                <Dropdown.Item
                  key={tag.id}
                  onClick={() => handleTagFilter(tag.name)}
                >
                  {tag.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      <div className="scroll-list">
        {filteredQuestions.map((item) => (
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
        ))}
      </div>

      <Form
        className="ask-ibu-form"
        onSubmit={(e) =>
          handleSubmit(e, setError, question, setQuestion)
        }
      >
        <FormGroup className="form-group">
          <Form.Control
            id="question"
            as="textarea"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder=""
          />
          {error && <div className="validation">{error}</div>}
        </FormGroup>
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </Form>
    </>
  );
};

export default AskIBU;
