import { useContext, useState } from "react";
import { ContentContext } from "../../../../context/ContentContext";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { SubmitShareContent } from "../../../../services/touchPointServices";
import { trackingUserAction } from "../../../../helper/helper";

const ShareContentPopup = ({ section, showModal, setShowModal }) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const { setIsLoading, setToast, updateContentShared, currentTabValue } =
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
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    message: false
  });
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
                    className={"input-with-icon" +
                      (error.name.error ? " error" : "") +
                      (isFocused.name ? " active" : "")
                    }
                  >
                    <span className="icon">
                      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-svg">
                        <path d="M3.70222 13.5869C7.25617 11.4709 11.7606 11.4708 15.3145 13.5869C15.7052 13.8195 16.4454 14.2124 17.1016 14.6465C17.7593 15.0816 18.496 15.6578 18.9132 16.3711C19.1222 16.7287 19.0022 17.1884 18.6446 17.3975C18.2871 17.6064 17.8273 17.4864 17.6182 17.1289C17.3851 16.7301 16.8993 16.3108 16.2745 15.8975C15.648 15.4831 15.0455 15.1728 14.5469 14.876C11.4659 13.0415 7.55087 13.0415 4.4698 14.876C3.97129 15.1728 3.36871 15.4831 2.74226 15.8975C2.1173 16.3109 1.63069 16.73 1.39753 17.1289C1.18842 17.4862 0.728656 17.6064 0.371164 17.3975C0.0139483 17.1883 -0.10631 16.7285 0.10261 16.3711C0.51975 15.6577 1.25639 15.0816 1.91413 14.6465C2.57048 14.2123 3.31148 13.8196 3.70222 13.5869Z" fill="#B5C2D3" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.50788 0C12.4074 0 14.7579 2.3505 14.7579 5.25C14.7579 8.14949 12.4074 10.5 9.50788 10.5C6.60839 10.5 4.25788 8.14949 4.25788 5.25C4.25788 2.3505 6.60839 0 9.50788 0ZM9.50788 1.5C7.43682 1.5 5.75788 3.17893 5.75788 5.25C5.75788 7.32107 7.43682 9 9.50788 9C11.579 9 13.2579 7.32107 13.2579 5.25C13.2579 3.17893 11.579 1.5 9.50788 1.5Z" fill="#B5C2D3" />
                      </svg>
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter HCP name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setIsFocused(prev => ({
                        ...prev, name: true
                      }))}
                      onBlur={() => setIsFocused(prev => ({
                        ...prev, name: false
                      }))}
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
                    className={"input-with-icon" +
                      (error.name.error ? " error" : "") +
                      (isFocused.email ? " active" : "")
                    }
                  >
                    <span className="icon">
                      <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.83038 0.0367951C9.78323 -0.0122598 11.7174 -0.0122703 13.6702 0.0367951C15.2216 0.0757754 16.4676 0.104667 17.4632 0.278006C18.4925 0.457314 19.3296 0.801922 20.0364 1.5114C20.7402 2.2179 21.0822 3.04271 21.2581 4.05535C21.4277 5.03232 21.4525 6.24871 21.4847 7.75847C21.5059 8.75443 21.5059 9.74495 21.4847 10.7409C21.4525 12.2506 21.4277 13.467 21.2581 14.444C21.0823 15.4566 20.74 16.2815 20.0364 16.988C19.3297 17.6974 18.4925 18.0421 17.4632 18.2214C16.4676 18.3947 15.2216 18.4236 13.6702 18.4626C11.7174 18.5116 9.78324 18.5116 7.83038 18.4626C6.27894 18.4236 5.03308 18.3947 4.03741 18.2214C3.00791 18.0421 2.17103 17.6975 1.46417 16.988C0.760314 16.2814 0.418361 15.4568 0.242486 14.444C0.072883 13.467 0.0481204 12.2507 0.0159232 10.7409C-0.00530575 9.74494 -0.00530975 8.75443 0.0159232 7.75847C0.0481185 6.24872 0.0728526 5.03231 0.242486 4.05535C0.418381 3.04276 0.760406 2.21787 1.46417 1.5114C2.17095 0.802098 3.00809 0.457266 4.03741 0.278006C5.03306 0.10472 6.279 0.0757713 7.83038 0.0367951ZM14.2054 7.81902C12.9121 8.55179 11.8608 8.99969 10.7483 8.99969C9.63597 8.99961 8.58448 8.55174 7.29131 7.81902L1.67022 4.63445C1.56681 5.42602 1.54499 6.42655 1.51592 7.78972C1.49513 8.76464 1.49514 9.73473 1.51592 10.7096C1.54908 12.2646 1.57435 13.3478 1.72002 14.1872C1.8596 14.9909 2.09952 15.5005 2.52667 15.9294C2.9509 16.3552 3.46683 16.5987 4.29424 16.7428C5.15535 16.8928 6.27126 16.9234 7.86749 16.9636C9.79529 17.012 11.7053 17.012 13.6331 16.9636C15.2293 16.9234 16.3453 16.8928 17.2064 16.7428C18.0335 16.5987 18.5498 16.3551 18.9739 15.9294C19.4008 15.5006 19.641 14.9907 19.7806 14.1872C19.9262 13.3478 19.9515 12.2645 19.9847 10.7096C20.0055 9.73475 20.0055 8.76463 19.9847 7.78972C19.9556 6.42535 19.9321 5.4244 19.8284 4.6325L14.2054 7.81902ZM13.6331 1.53582C11.7053 1.48738 9.79528 1.48739 7.86749 1.53582C6.27133 1.57592 5.15534 1.60661 4.29424 1.75652C3.46706 1.9006 2.95083 2.14438 2.52667 2.57C2.35282 2.74453 2.21075 2.93342 2.09307 3.1491L8.03155 6.51433C9.28641 7.22531 10.0483 7.49961 10.7483 7.49969C11.4485 7.49969 12.2101 7.22539 13.4651 6.51433L19.4046 3.14812C19.2871 2.93315 19.1473 2.74408 18.9739 2.57C18.5497 2.1442 18.0336 1.90065 17.2064 1.75652C16.3453 1.60656 15.2293 1.57593 13.6331 1.53582Z" fill="#B5C2D3" />
                      </svg>

                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter HCP email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(prev => ({
                        ...prev, email: true
                      }))}
                      onBlur={() => setIsFocused(prev => ({
                        ...prev, email: false
                      }))}
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
