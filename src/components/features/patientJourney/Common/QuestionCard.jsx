import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  deleteIbuQuestion,
  updateIbuQuestion,
} from "../../../../services/homeService";
import { ContentContext } from "../../../../context/ContentContext";

const QuestionCard = ({ question, account, updateDeleteQuestion }) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { setIsLoading, setToast } = useContext(ContentContext);
  const [isEditing, setIsEditing] = useState(false);
  const [questionText, setQuestionText] = useState(question.question);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditSubmission = async () => {
    try {
      await updateIbuQuestion(question.id, questionText, setIsLoading);
      updateDeleteQuestion(question.id, questionText, true);
      setIsEditing(false);
      setToast({
        show: true,
        type: "success",
        title: "Edited",
        message: "Question updated successfully.",
      });
    } catch (ex) {
      setToast({
        show: true,
        type: "danger",
        title: "Failed",
        message: "Failed to update the question.",
      });
    }
  };

  const handleDeleteQuestion = async () => {
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
            <textarea
              className="edit-input"
              placeholder="Edit your question..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            ></textarea>
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
                    onClick={() => {
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
                    onClick={() => {
                      setQuestionText(question.question);
                      setIsEditing(false);
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
          fullscreen
          dialogClassName="iframe-custom-modal"
        >
          <Modal.Header className="custom-modal-header">
            <button
              className="back-btn"
              onClick={() => setShowDeleteModal(false)}
            >
              close
            </button>

            <div className="modal-title">this is modal title</div>
          </Modal.Header>

          <Modal.Body className="custom-modal-body">
            this ismodal body
            <button type="button" onClick={handleDeleteQuestion}>
              Ok
            </button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default QuestionCard;
