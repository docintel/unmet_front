import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { fetchQuestions } from "../../../../services/homeService";
import { handleSubmit } from "../../../../services/homeService";

const AskIBU = () => {
  const [askIbu, setAskIbu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

useEffect(() => {
  const fetchData = async () => {
    const data = await fetchQuestions(setLoading);
    if (data) {
      setAskIbu(data);
    }
  };

  fetchData();
}, [question]);

 
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="scroll-list">
        {askIbu.map((item) => (
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
      <Form className="ask-ibu-form" onSubmit={(e) => handleSubmit(e,setError,question,setQuestion)}>
        <div className="form-group">
          <textarea
            className="form-control"
            id="question"
            rows="4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder=""
          ></textarea>
           {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </Form>
    </>
  );
};

export default AskIBU;
