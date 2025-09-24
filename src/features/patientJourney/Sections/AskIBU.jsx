import React from 'react'
import { Form } from 'react-bootstrap';
const AskIBU = () => {
  const askIbu = [
    {
      id: 13,
      user_id: 321,
      user_name: "Alisha",
      country: "India",
      visibility_status: "Private",
      question:
        "Q. Porttitor ultrices hendrerit consectetur et a pulvinar ac etiam vel. Tristique donec lobortis id sed. Vel id urna tellus tristique aliquam morbi Crassed?",
      answer: "all answers",
      status: 0,
      topics: ["valuweNew", "newwww"],
      delete_status: 0,
      updated: "2025-09-24T04:12:02.000Z",
      created: "2025-09-19T05:29:37.000Z",
    },
    {
      id: 10,
      user_id: 321,
      user_name: "Alisha",
      country: "India",
      visibility_status: "Published",
      question:
        "Q. masuismod phartra donec faucibus quisque nuneque mote condi ment zcsum nudolor nibhcmasa euismod phartra donec mas faucim nunc penatibus magna volutpat malesuada ullamcorper. Turpis nullam amet faucibbus quisque nuneque ipsum quamodio............................?",
      answer: "this is ignore answer",
      status: 0,
      topics: ["topics", "new", "tags"],
      delete_status: 0,
      updated: "2025-09-24T04:04:18.000Z",
      created: "2025-09-19T05:29:37.000Z",
    },
  ];
  return (
    <>
    <div>
      {askIbu.map((item) => (
        <div className="detail-data-box" key={item.id}>
          <div className="content-box">
            <div className="heading">
                {item.question}
            </div>
            <div className="region">
                {item.country}
            </div>
            <div className="tags">
                {item.topics.map((tag, idx) => (
                  <div key={idx}>
                    {tag}
                  </div>
                ))}                    
            </div>
            <div className="answer">
              <span>Answer:</span>
                {item.answer}
            </div>
            <div className="date">
              {item.created}
            </div>
          </div>
        </div>
      ))}
      </div>
      <Form className="ask-ibu-form">
        <div className="form-group">
          <textarea className="form-control" id="question" rows="4"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send</button>
      </Form>
    </>
  );
};

export default AskIBU;
