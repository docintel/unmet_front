import { useEffect, useState, useContext } from "react";
import { Row } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { getData } from "../../../../../services/axios/apiHelper";
import endPoint from "../../../../../services/axios/apiEndpoint";
import { ContentContext } from "../../../../../context/ContentContext";
import FixedSizeList from "../../Common/FixedSizedList";
import AskIbu from "./AskIbu";
import NoData from "../../Common/NoData";
import { useNavigate } from "react-router-dom";

const Account = () =>
{
  const [favorite, setFavorite] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [userData, setUserData] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);

  const { setIsLoading } = useContext(ContentContext);
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const navigate = useNavigate();
  useEffect(() =>
  {
    const fetchAllData = async () =>
    {
      setIsLoading(true);
      try {
        const [favoriteRes, recentRes, userRes] = await Promise.all([
          getData(endPoint.FAVORITE),
          getData(endPoint.GET_RECENT_CONTENT),
          getData(endPoint.USER_DETAILS),
        ]);

        setFavorite(favoriteRes?.data?.data || []);
        setRecentContent(recentRes?.data?.data || []);
        setUserData(userRes?.data?.data?.[0] || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="main-page">
      <div className="custom-container">
        <Row>
          <div className="account-section">
            <div className="account-header">
              <div className="profile">
                <div className="profile-img">
                  <img
                    src={
                      "https://api.dicebear.com/5.x/initials/svg?seed=" +
                      userData?.name
                    }
                    alt="profile"
                  />
                </div>
                <div className="profile-content">
                  <h4>{userData?.name}</h4>
                  <p>
                    <img src={path_image + "role-icon.svg"} alt="" />
                    {userData?.role ? userData?.role : "N/A"}
                  </p>
                  <p>
                    <img src={path_image + "region-icon.svg"} alt="" />
                    {userData?.region ? userData?.region : "N/A"}
                  </p>
                </div>
              </div>
              <div className="content-download">
                <div className="download">
                  <div className="label">
                    <img src={path_image + "download-img.svg"} alt="Download" />
                    <h6>Content Downloaded</h6>
                  </div>
                  <h5>{userData?.total_download ?? "00"}</h5>
                </div>
                <div className="shared">
                  <div className="label">
                    <img src={path_image + "share-img.svg"} alt="Shared" />
                    <h6>Content Shared</h6>
                  </div>
                  <h5>{userData?.total_shared ?? "00"}</h5>
                </div>
              </div>
            </div>
            <div className="account-tabs w-100">
              <Tabs defaultActiveKey="recent-view" className="account-tab-data">
                <Tab eventKey="recent-view" title={
                  <div className="d-flex align-items-center"><img
                    src={path_image + "recent.svg"}
                    alt="Recently viewed"
                    className="tab-icon"
                  /> Recently viewed
                    <div className="viewed-number"><span>{recentContent.length}</span></div></div>
                }>
                  <div className="touchpoint-data-boxes">
                    {recentContent.length > 0 ? (
                      recentContent && (
                        <FixedSizeList
                          items={recentContent}
                          itemCount={9}
                          favTab={false}
                        />
                      )
                    ) : (
                      <NoData
                        image="clock.svg"
                        title="You haven&apos;t viewed anything yet."
                        description="Explore the touchpoints to get started."
                        buttonText="Start Exploring"
                        onClick={() => navigate("/")}
                      />
                    )}
                  </div>
                </Tab>
                <Tab eventKey="favorite" title={<div className="d-flex align-items-center"><img
                  src={path_image + "like.svg"}
                  alt="Recently viewed"
                  className="tab-icon"
                />Likes<div className="viewed-number"><span>{recentContent.length}</span></div></div>
                }>
                  <div className="touchpoint-data-boxes">
                    {favorite.length > 0 ? (
                      favorite && (
                        <FixedSizeList
                          items={favorite}
                          itemCount={9}
                          favTab={true}
                        />
                      )
                    ) : (
                      <NoData
                        image="thumbs-up.svg"
                        title="You haven&apos;t liked anything yet."
                        description="Explore the touchpoints to get started."
                        buttonText="Start Exploring"
                        onClick={() => navigate("/")}
                      />
                    )}
                  </div>
                </Tab>
                <Tab eventKey="question" title={<div className="d-flex align-items-center"><img
                  src={path_image + "question.svg"}
                  alt="Recently viewed"
                  className="tab-icon"
                /> Your questions<div className="viewed-number"><span>{questionCount}</span></div></div>
                }>
                  <AskIbu setQuestionCount={setQuestionCount} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
};

export default Account;
