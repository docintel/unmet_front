import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Content from "../Common/Content";
import { toast } from "react-toastify";
import Pagination from "react-bootstrap/Pagination";
import { iconMapping } from "../../../../constants/iconMapping";

const Resources = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const contentPerPage = 5;
  const {
    content,
    fetchAgeGroups,
    filterAges,
    filterTag,
    categoryList,
    filterCategory,
  } = useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [categoryTags, setCategoryTags] = useState();
  const [tag, setTag] = useState([]);
  const [category, setCategory] = useState([]);
  const [ageGroup, setAgeGroup] = useState([]);
  const [filters, setFilters] = useState([]);
  // const [currentReadClick, setCurrentReadClick] = useState({
  //   previewArticle: null,
  //   id: null,
  // });
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [contentCategory, setContentCategory] = useState("All");
  const [tagShowAllClicked, setTagShowAllClicked] = useState(false);

  useEffect(() => {
    if (filterAges)
      setAgeGroup(
        [...filterAges].sort(
          (a, b) => a.id - b.id
          // b.label.localeCompare(a.label, undefined, { sensitivity: "base" })
        )
      );
    if (filterTag) setTag([...filterTag]);
    if (filterCategory)
      setCategory(
        [...filterCategory].sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { sensitivity: "base" })
        )
      );
  }, [filterAges, filterTag, filterCategory]);

  useEffect(() => {
    filterContents();
  }, [filters]);

  useEffect(() => {
    if (contents) {
      const newArr =
        contentCategory === "All"
          ? contents
          : contents.filter((item) => contentCategory.includes(item.category));
      setFilteredContents(newArr);
      setActivePage(1);
      setTotalPages(Math.ceil(newArr.length / contentPerPage));
      getCategoryTags(contents);
    }
  }, [contents]);

  useEffect(() => {
    filterContents();
  }, [contentCategory]);

  useEffect(() => {
    filterContents();
    if (content) getCategoryTags(content);
  }, [content]);

  useEffect(() => {
    (async () => {
      await fetchAgeGroups();
    })();
  }, []);

  useEffect(() => {
    if (searchText.length === 0) filterContents();
  }, [searchText]);

  const getCategoryTags = (content) => {
    if (categoryList) {
      const CategoryCount = { All: content.length };
      categoryList.map((cat) => {
        let count = 0;
        content.map((cntnt) => {
          if (cntnt.category === cat) count++;
        });
        CategoryCount[cat] = count;
      });

      setCategoryTags(CategoryCount);
    }
  };

  const filterContents = () => {
    if (content) {
      const filteredArray = [];
      content.map((item) => {
        if (
          item.title.toLowerCase().indexOf(searchText.toLowerCase() || "") != -1
        )
          filteredArray.push(item);
      });
      if (filteredArray) {
        const temp = [];
        filteredArray.forEach((element) => {
          let count = 0;
          for (let i = 0; i < filters.length; i++) {
            if (
              filters[i].typ === "age" &&
              element.age_groups.indexOf(filters[i].txt.split("<br />")[1]) !==
                -1
            )
              count++;
            else if (
              filters[i].typ === "cat" &&
              element.diagnosis.indexOf(filters[i].txt) !== -1
            )
              count++;
            else if (
              filters[i].typ === "tag" &&
              JSON.parse(element.tags.toLowerCase()).includes(
                filters[i].txt.toLowerCase()
              )
            )
              count++;
          }

          if (count === filters.length) temp.push(element);
        });
        setContents(temp);
      } else {
        setContents(filteredArray);
      }
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

  const selectFilters = (txt, id, typ) => {
    setFilters([...filters, { txt, id, typ }]);
    if (typ === "age")
      setAgeGroup(
        [...ageGroup]
          .filter((ag) => ag.id !== id)
          .sort(
            (a, b) => a.id - b.id
            // b.label
            //   .replace("&lt;", "<")
            //   .replace("&gt;", ">")
            //   .split(" ")[1]
            //   .slice(0, 2)
            //   .localeCompare(
            //     a.label
            //       .replace("&lt;", "<")
            //       .replace("&gt;", ">")
            //       .split(" ")[1]
            //       .slice(0, 2),
            //     undefined,
            //     { sensitivity: "base" }
            //   )
          )
      );
    else if (typ === "cat")
      setCategory(
        [...category]
          .filter((ct) => ct.id !== id)
          .sort((a, b) =>
            b.name.localeCompare(a.name, undefined, { sensitivity: "base" })
          )
      );
    else if (typ === "tag") setTag([...tag].filter((tg) => tg !== txt));
  };

  const removeFilters = (txt, id, typ) => {
    if (typ === "age") {
      setFilters([...filters].filter((ag) => ag.id !== id && typ === "age"));
      setAgeGroup(
        [...ageGroup, { label: txt, id }].sort(
          (a, b) => a.id - b.id
          // b.label
          //   .replace("&lt;", "<")
          //   .replace("&gt;", ">")
          //   .split(" ")[1]
          //   .slice(0, 2)
          //   .localeCompare(
          //     a.label
          //       .replace("&lt;", "<")
          //       .replace("&gt;", ">")
          //       .split(" ")[1]
          //       .slice(0, 2),
          //     undefined,
          //     { sensitivity: "base" }
          //   )
        )
      );
    } else if (typ === "cat") {
      setFilters([...filters].filter((ct) => ct.id !== id && typ === "cat"));
      setCategory(
        [...category, { name: txt, id }].sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { sensitivity: "base" })
        )
      );
    } else if (typ === "tag") {
      setFilters([...filters].filter((tg) => tg.txt !== txt && typ === "tag"));
      const tempArr = [...tag, txt];
      const filterArray = [];
      filterTag.forEach((item) => {
        if (tempArr.includes(item)) filterArray.push(item);
      });
      setTag(filterArray);
    }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <div className="main-page">
      <div className="custom-container">
        <Row>
          {" "}
          <div className="touchpoints-section">
            <div className="touchpoint-box resource-container">
              <div className="search-bar">
                {" "}
                <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                  <div className="inner-search d-flex align-items-center">
                    {filters && filters.length > 0 && (
                      <div className="tag-list d-flex">
                        {filters.map((fltr, idx) => (
                          <span key={idx} className="tag-item">
                            {fltr.typ === "age"
                              ? fltr.txt.split("<br />")[1]
                              : fltr.txt}{" "}
                            <button
                              className="cross-btn"
                              onClick={() =>
                                removeFilters(fltr.txt, fltr.id, fltr.typ)
                              }
                            >
                              ✖
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <Form.Control
                      type="search"
                      aria-label="Search"
                      placeholder="Search by tag or content title"
                      value={searchText}
                      name="search"
                      id="search"
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyUp={handleSearchTextKeyUp}
                    />
                  </div>
                  <Button variant="outline-success" onClick={handleSearchClick}>
                    <img src={path_image + "search-icon.svg"} alt="Search" />
                  </Button>
                </Form>
              </div>

              <div className="tags d-flex">
                <div className="tag-title">Touchpoints:</div>
                <div className="tag-list d-flex">
                  {category &&
                    category.map((cat) => (
                      <div
                        className="tag-item"
                        key={cat.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => selectFilters(cat.name, cat.id, "cat")}
                      >
                        {cat.name}
                      </div>
                    ))}
                </div>
              </div>
              <div className="tags d-flex">
                <div className="tag-title">Tags:</div>
                <div className="tag-list d-flex">
                  {tag &&
                    (tagShowAllClicked ? tag : tag.slice(0, 10)).map(
                      (tags, idx) => (
                        <div
                          className="tag-item"
                          key={idx}
                          style={{ cursor: "pointer" }}
                          onClick={() => selectFilters(tags, 0, "tag")}
                        >
                          {tags}
                        </div>
                      )
                    )}{" "}
                  {tag && tag.length > 10 && (
                    <Button
                      className={
                        tagShowAllClicked ? "show-less-btn" : "show-more-btn"
                      }
                      // Add class "show-less-btn" show less tags
                      onClick={() => setTagShowAllClicked(!tagShowAllClicked)}
                    >
                      <span>
                        {tagShowAllClicked ? "Show less" : "Show more"}
                      </span>
                      <img
                        src={`${path_image}right-arrow.svg`}
                        alt="Show more"
                        className="arrow-icon"
                      />
                    </Button>
                  )}
                </div>
              </div>
              <div className="tags d-flex">
                <div className="tag-title">Ages:</div>
                <div className="tag-list d-flex">
                  {ageGroup &&
                    ageGroup.map((ageGrp) => (
                      <div
                        className="tag-item"
                        key={ageGrp.id}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          selectFilters(
                            ageGrp.label
                              .replace("&lt;", "<")
                              .replace("&gt;", ">"),
                            ageGrp.id,
                            "age"
                          )
                        }
                      >
                        {
                          ageGrp.label
                            .replace("&lt;", "<")
                            .replace("&gt;", ">")
                            .split("<br />")[1]
                        }
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
                          className={`filter ${
                            contentCategory === cat ? "active" : ""
                          }`}
                          style={{ cursor: "pointer", userSelect: "none" }}
                          key={idx}
                          onClick={() => setContentCategory(cat)}
                        >
                          <img
                            src={
                              path_image + "icons/" + iconMapping.category[cat]
                            }
                            alt=""
                          />
                          {cat}
                          <div>
                            <span>{categoryTags[cat]}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="touchpoint-data-boxes">
                  {" "}
                  {filteredContents && filteredContents.length > 0 ? (
                    filteredContents.map(
                      (section, idx) =>
                        idx >= (activePage - 1) * contentPerPage &&
                        idx < activePage * contentPerPage && (
                          <React.Fragment key={section.id}>
                            <Content
                              section={section}
                              idx={section.id}
                              key={idx}
                              favTab={false}
                              // currentReadClick={currentReadClick}
                              // setCurrentReadClick={setCurrentReadClick}
                            />
                          </React.Fragment>
                        )
                    )
                  ) : (
                    <div className="no-data">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.9992 0.083374C5.86551 0.083374 0.0825195 5.86636 0.0825195 13C0.0825195 20.1337 5.86551 25.9167 12.9992 25.9167C16.1171 25.9166 18.9771 24.8119 21.2088 22.9724L23.7788 25.544C23.1258 26.9228 23.3658 28.6187 24.5063 29.7595L29.5747 34.8278C31.0256 36.2787 33.3777 36.2787 34.8286 34.8278C36.2796 33.3769 36.2796 31.0249 34.8286 29.5739L29.7603 24.5056C28.62 23.3655 26.9249 23.1245 25.5464 23.7764L22.9748 21.2048C24.8118 18.9737 25.9159 16.1158 25.9159 13C25.9159 5.86657 20.1326 0.0837142 12.9992 0.083374ZM26.2739 26.2732C26.7485 25.7986 27.518 25.7988 27.9927 26.2732L33.061 31.3415C33.5357 31.8161 33.5357 32.5856 33.061 33.0603C32.5864 33.5348 31.8169 33.5349 31.3423 33.0603L26.2739 27.9919C25.7996 27.5173 25.7995 26.7477 26.2739 26.2732ZM12.9992 2.58337C18.7519 2.58371 23.4159 7.24728 23.4159 13C23.4159 18.7528 18.7519 23.4164 12.9992 23.4167C7.24622 23.4167 2.58252 18.753 2.58252 13C2.58252 7.24707 7.24622 2.58337 12.9992 2.58337Z"
                          fill="#94A7BF"
                          fillOpacity="0.2"
                        />
                      </svg>
                      <h5>
                        Hmm… nothing here yet.
                        <br />
                        Try searching with different topics or title.
                      </h5>
                    </div>
                  )}
                </div>{" "}
                <div>
                  {totalPages && totalPages > 1 ? (
                    <Pagination className="custom-pagination">
                      <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={activePage === 1}
                        style={{ marginLeft: "auto" }}
                      />
                      <Pagination.Prev
                        onClick={() => handlePageChange(activePage - 1)}
                        disabled={activePage === 1}
                      />

                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === activePage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}

                      <Pagination.Next
                        onClick={() => handlePageChange(activePage + 1)}
                        disabled={activePage === totalPages}
                      />
                      <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={activePage === totalPages}
                      />
                    </Pagination>
                  ) : null}
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
