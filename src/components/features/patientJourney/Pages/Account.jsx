import React, { useEffect, useState, useContext, useCallback } from "react";
import { Row, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Content from "../Common/Content";
import { getData } from "../../../../services/axios/apiHelper";
import endPoint from "../../../../services/axios/apiEndpoint";
import AskIBU from "../Sections/AskIBU";
import { ContentContext } from "../../../../context/ContentContext";

const Account = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const [likedIndexes, setLikedIndexes] = React.useState([]);
  const [favorite, setFavorite] = useState([]);
  const [userData, setUserData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [currentReadClick, setCurrentReadClick] = useState({
    previewArticle: null,
    id: null,
  });
  const { setIsLoading } = useContext(ContentContext);

  const handleStarClick = (index) => {
    setLikedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const fetchData = useCallback(
    async (endpoint, setter) => {
      setIsLoading(true);
      try {
        const response = await getData(endpoint);
        setter(response?.data?.data || []);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        setter([]);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  useEffect(() => {
    fetchData(endPoint.FAVORITE, setFavorite);
    fetchData(endPoint.USER_DETAILS, (data) => setUserData(data?.[0] || {}));
  }, [fetchData]);

  return (
    <div className="main-page">
      <div className="custom-container">
        <Row>
          <div className="account-section">
            <div className="profile">
              <div className="profile-img">
                <img src={path_image + "dummy-circle.svg"} alt="profile" />
              </div>
              <div className="profile-content">
                <h4>{userData?.name}</h4>
                <p>{userData?.role ? userData?.role : "N/A"}</p>
                <p>{userData?.region ? userData?.region : "N/A"}</p>
              </div>
            </div>
            <div className="content-download">
              <div className="download">
                <h4>Content Download</h4>
                <p>00</p>
              </div>
              <div className="shared">
                <h4>Content Shared</h4>
                <p>00</p>
              </div>
            </div>
            <div className="account-tabs w-100">
              <Tabs defaultActiveKey="recent-view" className="account-tab-data">
                <Tab eventKey="recent-view" title="Recently viewed">
                  <div className="account-tabs-content">
                    <h6>Recently viewed</h6>
                  </div>
                  <div>
                    {favorite.length > 0 ? (
                      favorite &&
                      favorite.map((section) => (
                        <React.Fragment key={section.id}>
                          <Content
                            section={section}
                            idx={section.id}
                            currentReadClick={currentReadClick}
                            setCurrentReadClick={setCurrentReadClick}
                          />
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="no-data-found">No data Found</div>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="favorite" title="Favorite">
                  <div className="touchpoint-data-boxes">
                    {favorite.length > 0 ? (
                      favorite &&
                      favorite.map((section) => (
                        <React.Fragment key={section.id}>
                          <Content
                            section={section}
                            idx={section.id}
                            currentReadClick={currentReadClick}
                            setCurrentReadClick={setCurrentReadClick}
                          />
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="no-data-found">No data Found</div>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="question" title="Your questions">
                  <AskIBU />
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
