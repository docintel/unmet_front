const ActiveNarration = ({
  isInfoVisible,
  expandNarrative,
  activeNarration,
  isHcp,
  setExapandNarrative,
  setIsInfoVisible,
}) => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;

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
              className={`d-flex justify-content-between narrative-block ${
                expandNarrative ? "expanded" : "collapsed"
              }`}
            >
              <div className="content">
                <p className="content-title">
                  {activeNarration.narrative_title}
                </p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeNarration.narrative_description,
                  }}
                ></div>
              </div>
              <div className="content">
                <p className="content-title">
                  {activeNarration.contibution_title}
                </p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeNarration.contibution_description,
                  }}
                ></div>
              </div>
            </div>
            <div
              className={expandNarrative ? "read-less-btn" : "read-more-btn"}
            >
              <button
                className="btn btn-link"
                onClick={() => setExapandNarrative(!expandNarrative)}
              >
                Read {expandNarrative ? "Less" : "More"}{" "}
                <img
                  src={path_image + "read-more-icon.svg"}
                  alt={`read${expandNarrative ? "Less" : "More"}`}
                />
              </button>
            </div>
          </div>
        )
      ) : null}
      <div
        className="text-center dummy_data"
        style={{
          maxHeight: isInfoVisible ? "300px" : "0px",
          opacity: isInfoVisible ? 1 : 0,
          overflow: "hidden",
          transform: isInfoVisible ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.5s ease",
          padding: isInfoVisible ? "32px 12px" : "0",
          margin: isInfoVisible ? "0px 0px 80px" : "0",
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
            path_image + (isHcp ? "info-banner-dark.png" : "info-banner.png")
          }
          alt="No Data"
          style={{ userSelect: "none" }}
        />
      </div>
    </div>
  );
};

export default ActiveNarration;
