import React from "react";
const ActiveNarration = ({
  isInfoVisible,
  expandNarrative,
  activeNarration,
  expandNarrativeTitle,
  expandContributionTitle,
  setExpandNarrativeTitle,
  setExpandContributionTitle,
  isHcp,
  setExapandNarrative,
  setIsInfoVisible,
}) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 767);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="box-inner">
      {activeNarration ? (
        activeNarration.status === "Missing" ? (
          <div className="message-info">
            <div className="message">
              <div className="info-icon">
                <img src={path_image + "info-icon.svg"} alt="" />
              </div>
              <p className="info-text">Narrative in preparation...</p>
            </div>
          </div>
        ) : activeNarration.status === "Not applicable" ? (
          <div className="message-info">
            <div className="message">
              <div className="info-icon">
                <img src={path_image + "info-icon.svg"} alt="" />
              </div>
              <p className="info-text">Narrative in preparation...</p>
            </div>
          </div>
        ) : activeNarration.status === "Draft" ? (
          <div className="message-info">
            <div className="message">
              <div className="info-icon">
                <img src={path_image + "info-icon.svg"} alt="" />
              </div>
              <p className="info-text">Narrative in preparation...</p>
            </div>
          </div>
        ) : (
          <div className="touchpoint-data">
            <div
              className={`d-flex ${
                isMobile ? "flex-column" : "justify-content-between"
              } narrative-block ${!isMobile && expandNarrative ? "expanded" : "collapsed"}`}
            >
              <div className={`content ${isMobile && expandNarrativeTitle ? "expanded" : "collapsed"}`}>
                <p className="content-title">
                  {activeNarration.narrative_title}
                </p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeNarration.narrative_description,
                  }}
                ></div>
                {isMobile && (
                  <div
                    className={
                      expandNarrativeTitle ? "read-less-btn" : "read-more-btn"
                    }
                    style={{ marginTop: isMobile ? "20px" : "inherit" }}
                  >
                    <button
                      className="btn btn-link"
                      onClick={() => setExpandNarrativeTitle((prev) => !prev)}
                    >
                      Read {expandNarrativeTitle ? "Less" : "More"}{" "}
                      <img
                        src={path_image + "read-more-icon.svg"}
                        alt={`read${expandNarrativeTitle ? "Less" : "More"}`}
                      />
                    </button>
                  </div>
                )}
              </div>
              <div className={`content ${isMobile && expandContributionTitle ? "expanded" : "collapsed"}`}>
                <p className="content-title">
                  {activeNarration.contibution_title}
                </p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeNarration.contibution_description,
                  }}
                ></div>
                {isMobile && (
                  <div
                    className={
                      expandContributionTitle
                        ? "read-less-btn"
                        : "read-more-btn"
                    }
                    style={{ marginTop: isMobile ? "20px" : "inherit" }}
                  >
                    <button
                      className="btn btn-link"
                      onClick={() =>
                        setExpandContributionTitle((prev) => !prev)
                      }
                    >
                      Read {expandContributionTitle ? "Less" : "More"}{" "}
                      <img
                        src={path_image + "read-more-icon.svg"}
                        alt={`read${expandContributionTitle ? "Less" : "More"}`}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {!isMobile && (
              <div
                className={expandNarrative ? "read-less-btn" : "read-more-btn"}
                style={{ marginTop: isMobile ? "20px" : "inherit" }}
              >
                <button
                  className="btn btn-link"
                  onClick={() => setExapandNarrative((prev) => !prev)}
                >
                  Read {expandNarrative ? "Less" : "More"}{" "}
                  <img
                    src={path_image + "read-more-icon.svg"}
                    alt={`read${expandNarrative ? "Less" : "More"}`}
                  />
                </button>
              </div>
            )}
          </div>
        )
      ) : null}
      <div
        className="text-center dummy_data"
        style={{
          maxHeight: isInfoVisible ? (isMobile ? "380px" : "300px") : "0px",
          opacity: isInfoVisible ? 1 : 0,
          overflow: "hidden",
          transform: isInfoVisible ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.5s ease",
          padding: isInfoVisible
            ? isMobile
              ? "40px 8px 32px"
              : "32px 12px"
            : "0",
          margin: isInfoVisible
            ? isMobile
              ? "0px 0px 60px"
              : "0px 0px 80px"
            : "0",
        }}
      >
        <div className="close-icon">
          <img
            src={path_image + "cross-btn.svg"}
            alt="No Data"
            onClick={() => setIsInfoVisible(false)}
          />
        </div>
        <img
          src={
            path_image +
            (isHcp
              ? isMobile
                ? "info-banner-mobile.png"
                : "info-banner-dark.png"
              : isMobile
              ? "info-banner-mobile.png"
              : "info-banner.png")
          }
          alt="No Data"
        />
      </div>
    </div>
  );
};

export default ActiveNarration;
