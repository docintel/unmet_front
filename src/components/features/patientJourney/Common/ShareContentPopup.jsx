import { useContext, useState } from "react";
import { ContentContext } from "../../../../context/ContentContext";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { SubmitShareContent } from "../../../../services/touchPointServices";
import { trackingUserAction } from "../../../../helper/helper";

const ShareContentPopup = ({ section, showModal, setShowModal }) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { setIsLoading, setToast, updateContentShared ,currentTabValue} =
    useContext(ContentContext);
  const [error, setError] = useState({
    name: { error: false, message: "" },
    email: { error: false, message: "" },
    global: { error: false, message: "" },
  });
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const emptyFormField = () => {
    setError({
      name: { error: false, message: "" },
      email: { error: false, message: "" },
      global: { error: true, message: "" },
    });
    setEmail("");
    setName("");
    setMessage("");
    setShowConfirmationModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    emptyFormField();
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    try {
      let newError = {
        name: { error: false, message: "" },
        email: { error: false, message: "" },
        global: { error: false, message: "" },
      };

      if (!email) {
        newError.email = { error: true, message: "Email is required" };
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newError.email = {
          error: true,
          message: "Please enter valid email",
        };
      }

      if (!name) {
        newError.name = { error: true, message: "Name is required" };
      }

      setError(newError);

      if (newError.name.error || newError.email.error) return;

      await SubmitShareContent(
        section.id,
        email,
        name,
        message,
        setIsLoading,
        setToast
      );
      updateContentShared();
      trackingUserAction(
        "content_shared",
        {
          pdf_id: section?.id,
          receiver_name: name,
          receiver_email: email,
          message: message,
        },
        currentTabValue
      );
      setShowModal(false);
      setShowConfirmationModal(true);
    } catch (ex) {
      setError({
        name: { error: false, message: "" },
        email: { error: false, message: "" },
        global: { error: true, message: "Oops!! Something went wrong." },
      });
    }
  };

  return (
    <>
      <div className="pop_up">
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
          centered
          className="share-modal"
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Share content with HCP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="share-form">
              <Form className="registration-form">
                <Form.Group className="form-group">
                  <Form.Label>
                    HCP Name{" "}
                    <span style={{ fontWeight: "lighter" }}>(Required)</span>
                  </Form.Label>
                  <div
                    className={
                      "input-with-icon" + (error.name.error ? " error" : "")
                    }
                  >
                    <span className="icon">
                      <img src={path_image + "hcp-name.svg"} alt="Logo" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>{" "}
                  {error.name.error && (
                    <div className="validation">{error.name.message}</div>
                  )}
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>
                    HCP Email{" "}
                    <span style={{ fontWeight: "lighter" }}>(Required)</span>
                  </Form.Label>
                  <div
                    className={
                      "input-with-icon" + (error.email.error ? " error" : "")
                    }
                  >
                    <span className="icon">
                      <img src={path_image + "hcp-email.svg"} alt="Logo" />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {error.email.error && (
                    <div className="validation">{error.email.message}</div>
                  )}
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>Message </Form.Label>
                  <div className={"textarea-with-icon"}>
                    <Form.Control
                      as="textarea"
                      type="textarea"
                      placeholder="Type your message for the HCP"
                      value={message}
                      className="styled-textarea"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </Form.Group>
                <div className="form-buttons">
                  <button
                    className="btn cancel"
                    type="button"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <Button
                    className="btn share"
                    type="button"
                    onClick={handleSubmitClick}
                  >
                    Share
                    <img src={path_image + "send-icon.svg"} alt="" />
                  </Button>
                </div>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <div className="pop_up">
        <Modal
          show={showConfirmationModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
          centered
          className="confirmation"
          size="lg"
        >
          <Modal.Body>
            <div className="confirmation-card">
              <div className="check-icon">
                <img src={path_image + "check-icon-img.png"} alt="success" />
              </div>
              <h2 className="title">You&apos;re All Done — Content Shared</h2>
              <div className="description-box">
                <p className="description">
                  HCP will receive an email shortly with a secure link to access
                  the content on <b>One Source</b>.
                </p>

                <Button
                  type="button"
                  className="btn done"
                  onClick={handleCloseModal}
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

export default ShareContentPopup;
