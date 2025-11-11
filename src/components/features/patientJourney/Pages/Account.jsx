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
import FixedSizeList from "../Common/FixedSizedList";

const Account = () =>
{
  const [favorite, setFavorite] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [userData, setUserData] = useState([]);

  const { setIsLoading } = useContext(ContentContext);
  const path_image = import.meta.env.VITE_IMAGES_PATH;
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
                  <p><img src={path_image + "role-icon.svg"} alt="" />{userData?.role ? userData?.role : "N/A"}</p>
                  <p><img src={path_image + "region-icon.svg"} alt="" />{userData?.region ? userData?.region : "N/A"}</p>
                </div>
              </div>
              <div className="content-download">
                <div className="download">
                  <div className="label">
                    <img src={path_image + "download-img.svg"} alt="Download" />
                    <h4>Content Downloaded</h4>
                  </div>
                  <span>{userData?.total_download ?? "00"}</span>
                </div>
                <div className="shared">
                  <div className="label">
                    <img src={path_image + "share-img.svg"} alt="Shared" />
                    <h4>Content Shared</h4>
                  </div>
                  <span>{userData?.total_shared ?? "00"}</span>
                </div>
              </div>
            </div>
            <div className="account-tabs w-100">
              <Tabs defaultActiveKey="recent-view" className="account-tab-data">
                <Tab eventKey="recent-view" title="Recently viewed">
                  {/* <div className="account-tabs-content">
                    <h6>Recently viewed</h6>
                  </div> */}
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
                      // recentContent.map((section) => (
                      //   <React.Fragment key={section.id}>
                      //     <Content
                      //       section={section}
                      //       idx={section.id}
                      //       favTab={false}
                      //     />
                      //   </React.Fragment>
                      // ))
                      <div className="no_data_found">No data Found</div>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="favorite" title="Favourite">
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
                      // favorite.map((section) => (
                      //   <React.Fragment key={section.id}>
                      //     <Content
                      //       section={section}
                      //       idx={section.id}
                      //       favTab={true}
                      //     />
                      //   </React.Fragment>
                      // ))
                      <div className="no_data_found">No data Found</div>
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
