import { useEffect, useState, useContext } from "react";
import { Dropdown, Modal, Row, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ContentContext } from "../../../../../context/ContentContext";
import FixedSizeList from "../../Common/FixedSizedList";
import AskIbu from "./AskIbu";
import NoData from "../../Common/NoData";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  clearLocalStorage,
  trackingUserAction,
} from "../../../../../helper/helper";
import { deleteUserProfile } from "../../../../../services/touchPointServices";
import EditProfilePopup from "./EditProfilePopup";

const Account = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const location = useLocation();
  const navigate = useNavigate();
  const cameFromSsi = location.state?.fromSsi;
  const {
    favorite,
    recentContent,
    userData,
    currentTabValue,
    getAccountData,
    setContentHolder,
    setToast,
    setIsLoading,
  } = useContext(ContentContext);
  const [questionCount, setQuestionCount] = useState(0);
  const [editProfilePopupShow, setEditProfilePopupShow] = useState(false);
  const [deleteProfilePopupShow, setDeleteProfilePopupShow] = useState(false);

  useEffect(() => {
    (async () => await getAccountData())();
  }, []);

  useEffect(() => {
    setContentHolder(`${cameFromSsi ? "question" : "recent-view"}`);
    trackingUserAction(
      "tab_selected",
      `${(cameFromSsi ? "question" : "recent-view").replaceAll(
        "-",
        " "
      )} tab clicked`,
      currentTabValue
    );
  }, [cameFromSsi]);

  const handleTabSelect = async (key) => {
    setContentHolder(key);
    await trackingUserAction(
      "tab_selected",
      `${key.replaceAll("-", " ")} tab clicked`,
      currentTabValue
    );
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      await deleteUserProfile(setToast, setIsLoading);
      await trackingUserAction(
        "profile_deleted",
        `user_profile_deleted`,
        currentTabValue
      );
      clearLocalStorage();
      navigate("/login");
    } catch (ex) {}
  };

  return (
    <div className="main-page">
      <div className="custom-container">
        <Row>
          <div className="account-section">
            <div className="account-header">
              <div className="profile">
                <div className="profile-img">
                  <img src={path_image + "userprofile.png"} alt="profile" />
                </div>
                <div className="profile-content">
                  <h4>{userData?.name}</h4>
                  <div className="profile-details">
                    <p>
                      <svg
                        width="22"
                        height="21"
                        viewBox="0 0 22 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 13.2565L11 14.7565"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 9.25647L2.15288 12.1197C2.31714 15.7335 2.39927 17.5403 3.55885 18.6484C4.71843 19.7565 6.52716 19.7565 10.1446 19.7565H11.8554C15.4728 19.7565 17.2816 19.7565 18.4412 18.6484C19.6007 17.5403 19.6829 15.7335 19.8471 12.1197L20 9.25647"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.84718 8.69953C3.54648 11.9309 7.3792 13.2565 11 13.2565C14.6208 13.2565 18.4535 11.9309 20.1528 8.69953C20.964 7.15703 20.3498 4.25647 18.352 4.25647H3.648C1.65023 4.25647 1.03603 7.15703 1.84718 8.69953Z"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M15 4.25647L14.9117 3.94741C14.4717 2.40736 14.2517 1.63734 13.7279 1.1969C13.2041 0.75647 12.5084 0.75647 11.117 0.75647H10.883C9.49159 0.75647 8.79587 0.75647 8.2721 1.1969C7.74832 1.63734 7.52832 2.40736 7.0883 3.94741L7 4.25647"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                        />
                      </svg>
                      {userData?.role ? userData?.role : "N/A"}
                    </p>
                    <p>
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 11.2565C21 5.73362 16.5228 1.25647 11 1.25647C5.47715 1.25647 1 5.73362 1 11.2565C1 16.7793 5.47715 21.2565 11 21.2565C16.5228 21.2565 21 16.7793 21 11.2565Z"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M19 4.95546C18.0653 5.02283 16.8681 5.38471 16.0379 6.45924C14.5385 8.40008 13.039 8.56203 12.0394 7.91508C10.5399 6.94467 11.8 5.37283 10.0401 4.51862C8.89313 3.96189 8.73321 2.44692 9.37158 1.25647"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 10.2565C1.7625 10.9186 2.83046 11.5247 4.08874 11.5247C6.68843 11.5247 7.20837 12.0214 7.20837 14.0083C7.20837 15.9951 7.20837 15.9951 7.72831 17.4853C8.06651 18.4546 8.18472 19.4239 7.5106 20.2565"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12.7088C20.1129 12.1976 19 11.9873 17.8734 12.7969C15.7177 14.3463 14.2314 13.0625 13.5619 14.3454C12.5765 16.234 16.0957 16.8276 13 21.2565"
                          stroke="#B5C2D3"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {!userData?.country ? (
                        // && !userData?.region
                        "N/A"
                      ) : (
                        <>
                          {[
                            // userData?.region || " ",
                            userData?.country || " ",
                          ]
                            .join(", ")
                            .replace(" ,", "")
                            .replace(",  ", "")}
                        </>
                      )}{" "}
                    </p>
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Dropdown align="end" className="profile-menu">
                    <Dropdown.Toggle as="span" style={{ cursor: "pointer" }}>
                      <img src={path_image + "options.svg"} alt="dropdown" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="profile-dropdown">
                      <Dropdown.Item
                        onClick={() => setEditProfilePopupShow(true)}
                      >
                        <img
                          src={path_image + "edit-gray-icon.svg"}
                          alt=""
                          className="menu-icon"
                        />
                        <span>Edit Profile</span>
                      </Dropdown.Item>

                      <Dropdown.Item
                        className="delete-item"
                        onClick={() => setDeleteProfilePopupShow(true)}
                      >
                        <img
                          src={path_image + "delete-icon.svg"}
                          alt=""
                          className="menu-icon"
                        />
                        <span>Delete Account</span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="content-download">
                <div className="download">
                  <div className="label">
                    <img src={path_image + "download-img.svg"} alt="Download" />
                    <h6>Content Downloaded</h6>
                  </div>
                  <h5>{userData?.total_download ?? "0"}</h5>
                </div>
                <div className="shared">
                  <div className="label">
                    <img src={path_image + "share-img.svg"} alt="Shared" />
                    <h6>Content Shared</h6>
                  </div>
                  <h5>{userData?.total_shared ?? "0"}</h5>
                </div>
              </div>
            </div>
            <div className="account-tabs w-100">
              <Tabs
                defaultActiveKey={`${cameFromSsi ? "question" : "recent-view"}`}
                className="account-tab-data"
                onSelect={(key) => handleTabSelect(key)}
              >
                <Tab
                  eventKey="recent-view"
                  title={
                    <div className="d-flex align-items-center">
                      <img
                        src={path_image + "recent.svg"}
                        alt="Recently viewed"
                        className="tab-icon"
                      />{" "}
                      Recently viewed
                      <div className="viewed-number">
                        <span>{recentContent.length}</span>
                      </div>
                    </div>
                  }
                >
                  <div className="touchpoint-data-boxes">
                    {recentContent && recentContent.length > 0 ? (
                      <FixedSizeList
                        items={recentContent}
                        itemCount={9}
                        favTab={false}
                        sortingAllowed={false}
                      />
                    ) : (
                      <NoData
                        image="clock.svg"
                        title="You haven't viewed anything yet."
                        description="Explore the touchpoints to get started."
                        buttonText="Start Exploring"
                        onClick={() => navigate("/touchpoints")}
                      />
                    )}
                  </div>
                </Tab>
                <Tab
                  eventKey="favorite"
                  title={
                    <div className="d-flex align-items-center">
                      <img
                        src={path_image + "like.svg"}
                        alt="Recently viewed"
                        className="tab-icon"
                      />
                      Likes
                      <div className="viewed-number">
                        <span>{favorite.length}</span>
                      </div>
                    </div>
                  }
                >
                  <div className="touchpoint-data-boxes">
                    {favorite && favorite.length > 0 ? (
                      <FixedSizeList
                        items={favorite}
                        itemCount={9}
                        favTab={false}
                        sortingAllowed={false}
                      />
                    ) : (
                      <NoData
                        image="thumbs-up.svg"
                        title="You haven't liked anything yet."
                        description="Explore the touchpoints to get started."
                        buttonText="Start Exploring"
                        onClick={() => navigate("/touchpoints")}
                      />
                    )}
                  </div>
                </Tab>
                <Tab
                  eventKey="question"
                  title={
                    <div className="d-flex align-items-center">
                      <img
                        src={path_image + "question.svg"}
                        alt="Recently viewed"
                        className="tab-icon"
                      />{" "}
                      Your questions
                      <div className="viewed-number">
                        <span>{questionCount}</span>
                      </div>
                    </div>
                  }
                >
                  <AskIbu setQuestionCount={setQuestionCount} />
                </Tab>
              </Tabs>
            </div>
          </div>
          <EditProfilePopup
            editProfilePopupShow={editProfilePopupShow}
            setEditProfilePopupShow={setEditProfilePopupShow}
            userData={userData}
          />
        </Row>
      </div>
      <div className="pop_up">
        <Modal
          show={deleteProfilePopupShow}
          onHide={() => setDeleteProfilePopupShow(false)}
          backdrop="static"
          keyboard={false}
          centered
          className="confirmation"
          size="lg"
        >
          <Modal.Body>
            <div className="confirmation-card delete-account">
              <div className="check-icon">
                <img src={path_image + "alert-icon.svg"} alt="success" />
              </div>

              <h2 className="title">
                Are you sure you want to delete your account?
              </h2>
              <div className="description-box">
                <p className="description delete-msg">
                  If you continue, your account and all saved content will be
                  permanently removed from VWD Journey.
                </p>

                <p className="note">This action can&apos;t be undone.</p>

                <div className="confirmation-btn">
                  <button
                    className="cencel"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteProfilePopupShow(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete"
                    type="button"
                    onClick={handleDeleteAccount}
                  >
                    Delete my account
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

export default Account;
