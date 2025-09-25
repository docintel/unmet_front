import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";

const AskIBU = () => {
  const [askIbu, setAskIbu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://192.168.10.11:3001/narrative/all-questions",
          {
            headers: {
              Auth: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndpbHByb3BoeUBpbmZvcm1lZC5wcm8iLCJuYW1lIjoid2lscHJvcGh5IiwiZ3JvdXBJZCI6MywibG9naW5UeXBlIjoiZGlyZWN0IiwidXNlclRva2VuIjoiRk9rQi9BVVQyd0dYUnYgYWJscXZiZz09IiwicGFzc3dvcmRJZCI6MjE0NzU0MTMwMCwiaWF0IjoxNzU4NzgyOTkzLCJleHAiOjE3NTg3ODY1OTN9.6DH2IzIMeRkwjLTOptpxQxyGyRZ0f2WrBAAPFPpJzRE`,
              Token: "FOkB/AUT2wGXRv ablqvbg==",
            },
          }
        );
        setAskIbu(response?.data?.data);
      } catch (error) {
        console.error("Error fetching Ask IBU questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setError(""); 
    try {
      const response = await axios.post(
        "http://192.168.10.11:3001/auth/add-ibu-question",
        {
          userId: 321,
          question: question,
        },
      );


      setQuestion("");
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

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

      <Form className="ask-ibu-form" onSubmit={handleSubmit}>
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
