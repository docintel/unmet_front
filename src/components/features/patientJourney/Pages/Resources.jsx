import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Content from "../Common/Content";

const Resources = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const { content } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentReadClick, setCurrentReadClick] = useState({
    previewArticle: null,
    id: null,
  });

  useEffect(() => {
    filterContents();
  });

  const filterContents = () => {
    if (searchText) {
      const filteredArray = [];
      content.map((item) => {
        if (item.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1)
          filteredArray.push(item);
      });
      setContents(filteredArray);
    } else {
      setContents(content);
    }
  };

  const handleSearchClick = (e) => {
    if (e) e.preventDefault();
    if (searchText.length >= 3 || searchText.length === 0) filterContents();
    else toast("Please enter at least three characters to search");
  };

  const handleSearchTextKeyUp = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <div className="main-page">
      <div className="custom-container">
        <Row>
          <div>Resources</div>
          <div className="search-bar">
            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="search"
                aria-label="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyUp={handleSearchTextKeyUp}
              />
              <Button variant="outline-success" onClick={handleSearchClick}>
                <img src={path_image + "search-icon.svg"} alt="Search" />
              </Button>
            </Form>
          </div>
          <div className="tags d-flex">
            <div className="tag-title">Tags:</div>
            <div className="tag-list d-flex">
              {/* {contentTags &&
                contentTags.map((tag, idx) => (
                  <div className="tag-item" key={idx}>
                    {tag}
                  </div>
                ))} */}
            </div>
          </div>
          <div className="content-count-box">
            <div className="content-count">
              {/* {categoryTags &&
                Object.keys(categoryTags).map((cat, idx) => {
                  return (
                    <div
                      className={cat.toLowerCase() == "all" ? "all" : ""}
                      key={idx}
                    >
                      {cat}
                      <br />
                      {categoryTags[cat]}
                    </div>
                  );
                })} */}
            </div>
            <div className="touchpoint-data-boxes">
              {" "}
              {contents ? (
                contents &&
                contents.map((section, idx) => (
                  <React.Fragment key={section.id}>
                    <Content
                      section={section}
                      idx={section.id}
                      key={idx}
                      currentReadClick={currentReadClick}
                      setCurrentReadClick={setCurrentReadClick}
                    />
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center  w-100">No data Found</div>
              )}
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
};

export default Resources;
