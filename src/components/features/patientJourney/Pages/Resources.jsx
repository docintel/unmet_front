import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Content from "../Common/Content";
import { fetchAgeGroupCategories } from "../../../../services/touchPointServices";

const Resources = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const { content } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryTags, setCategoryTags] = useState();
  const [ageGroup, setAgeGroup] = useState();
  const [categories, setCategories] = useState();
  const [tag, setTag] = useState();

  const [currentReadClick, setCurrentReadClick] = useState({
    previewArticle: null,
    id: null,
  });

  useEffect(() => {
    filterContents();
    if (content) getCategoryTags(content);
  }, [content]);

  useEffect(() => {
    (async () => {
      const { ageGroups, category, tags } = await fetchAgeGroupCategories();
      setAgeGroup(ageGroups);
      setCategories(category);
      setTag(tags);
    })();
  }, []);

  useEffect(() => {
    if (searchText.length === 0) filterContents();
  }, [searchText]);

  const getCategoryTags = (content) => {
    const CategoryCount = { all: content.length };
    content.map((cntnt) => {
      CategoryCount[cntnt.category] = (CategoryCount[cntnt.category] || 0) + 1;
    });

    setCategoryTags(CategoryCount);
  };

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
          {" "}
          <div className="touchpoints-section">
            <div className="touchpoint-box">
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
                <div className="tag-title">Touchpoints:</div>
                <div className="tag-list d-flex">
                  {categories &&
                    categories.map((cat) => (
                      <div className="tag-item" key={cat.id}>
                        {cat.name}
                      </div>
                    ))}
                </div>
              </div>
              <div className="tags d-flex">
                <div className="tag-title">Tags:</div>
                <div className="tag-list d-flex">
                  {tag &&
                    tag.map((tag, idx) => (
                      <div className="tag-item" key={idx}>
                        {tag}
                      </div>
                    ))}
                </div>
              </div>
              <div className="tags d-flex">
                <div className="tag-title">Ages:</div>
                <div className="tag-list d-flex">
                  {ageGroup &&
                    ageGroup.map((ageGrp) => (
                      <div className="tag-item" key={ageGrp.id}>
                        {ageGrp.label.split("<br />")[1]}
                      </div>
                    ))}
                </div>
              </div>
              <div className="content-count-box">
                <div className="content-count">
                  {categoryTags &&
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
                    })}
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
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
};

export default Resources;
