import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import
{
  deleteIbuQuestion,
  updateIbuQuestion,
} from "../../../../services/homeService";
import { ContentContext } from "../../../../context/ContentContext";

const QuestionCard = ({ question, account, updateDeleteQuestion }) =>
{
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { setIsLoading, setToast } = useContext(ContentContext);
  const [isEditing, setIsEditing] = useState(false);
  const [questionText, setQuestionText] = useState(question.question);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inputError, setInputError] = useState("")

  const handleEditSubmission = async () =>
  {
    try {
      if (!questionText || !questionText.trim()) {
        setInputError("Question is required.")
        return;
      }
      await updateIbuQuestion(question.id, questionText.trim(), setIsLoading);
      updateDeleteQuestion(question.id, questionText.trim(), true);
      setQuestionText(questionText.trim())
      setIsEditing(false);
      setToast({
        show: true,
        type: "success",
        title: "Edited",
        message: "Question updated successfully.",
      });
      setInputError("")
    } catch (ex) {
      setToast({
        show: true,
        type: "danger",
        title: "Failed",
        message: "Failed to update the question.",
      });
      setInputError("")
    }
  };

  const handleDeleteQuestion = async () =>
  {
    try {
      await deleteIbuQuestion(question.id, setIsLoading);
      updateDeleteQuestion(question.id, "", false);
      setShowDeleteModal(false);
      setToast({
        show: true,
        type: "success",
        title: "Deleted",
        message: "Question deleted successfully.",
      });
    } catch (ex) {
      setToast({
        show: true,
        type: "danger",
        title: "Failed",
        message: "Failed to remove the question.",
      });
    }
  };

  return (
    <div className="detail-data-box ask-ibu-question">
      <div className="question-header">
        <span className="question-label">Question</span>
        {account && (
          <div className="answer-status">
            <img
              src={
                path_image +
                (question.visibility_status === "Not Answer"
                  ? "timer-icon.svg"
                  : "checked-icon.svg")
              }
              alt=""
            />
            <span className="info-message">
              {question.visibility_status === "Not Answer"
                ? "Waiting for IBU's answer..."
                : "Answered by IBU"}
            </span>
          </div>
        )}
      </div>
      <div className="content-box">
        <div className="question-section">
          {!isEditing && <div className="heading">{questionText}</div>}
          {account && isEditing && (
            <div className={inputError ? "error" : "answer-textarea"}>
              {" "}
              <textarea
                className="edit-input"
                placeholder="Edit your question..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              ></textarea>
              {inputError && <span>{inputError}</span>}
            </div>
          )}
          <div className="region">
            {question.region}, {question.country}
          </div>
        </div>
        {question.visibility_status !== "Not Answer" && (
          <div className="answer-section">
            <span className="answer-label">Answer</span>
            <div className="answer">{question.answer}</div>
            {question.topics && question.topics.length > 0 && (
              <div className="q-tags">
                {question.topics.map((item, index) => (
                  <div className="" key={index}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="footer">
          <div className="date">{question.created}</div>
          {account && question.visibility_status === "Not Answer" && (
            <div className="q-actions">
              {!isEditing ? (
                <>
                  <button
                    className="icon-btn delete"
                    onClick={() =>
                    {
                      setShowDeleteModal(true);
                    }}
                  >
                    <img src={path_image + "delete-icon.svg"} alt="" />
                  </button>
                  <button
                    className="icon-btn edit"
                    onClick={() => setIsEditing(true)}
                  >
                    <img src={path_image + "edit-icon.svg"} alt="" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="cancel-btn"
                    onClick={() =>
                    {
                      setQuestionText(question.question);
                      setIsEditing(false);
                      setInputError("")
                    }}
                  >
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleEditSubmission}>
                    Save
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pop_up">
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal((prev) => !prev)}
          backdrop="static"
          keyboard={false}
          centered
          className="confirmation"
        >
          <Modal.Body>
            <div className="confirmation-card delete">
              <div className="check-icon">
                <img
                  src={path_image + "alert-icon.svg"}
                  alt="success"
                />
              </div>

              <h2 className="title">Delete this question?</h2>
              <div className="description-box">
                <p className="description">
                  Your question is still awaiting IBU&apos;s answer. If you delete it, you won&apos;t receive a reply and it will be removed from My Account.
                </p>

                <p className="note">
                  This action can&apos;t be undone.
                </p>

                <div className="confirmation-btn">
                  <button
                    className="cencel"
                    type="button"
                    onClick={() =>
                    {
                      setShowDeleteModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete"
                    type="button"
                    onClick={handleDeleteQuestion}
                  >
                   Delete question
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default QuestionCard;
