const QuestionCard = ({ question, account }) => {
  return (
    <>
      <div className="detail-data-box ask-ibu-question" key="">
        <div className="question-header">
          <span className="question-label">Question</span>
        </div>
        <div className="content-box">
          <div className="heading">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's{" "}
          </div>
          <div className="region">Region, Country</div>
          {/* <hr className="divider" /> */}
          <div className="answer-section">
            <span className="answer-label">Answer</span>
            <div className="answer">
              Answer lorem ipsum dolor sit amet consectetur. Odio erat sed vitae
              pulvinar
            </div>
            <div className="q-tags">
              <div className="f-tag">Tag...</div>
              <div>Tag...</div>
              <div>Tag...</div>
            </div>
            <div className="date">29.July.2025</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
