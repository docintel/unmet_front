import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { ContentContext } from "../../../../context/ContentContext";
import Content from "../Common/Content";
import { toast } from "react-toastify";
import Pagination from "react-bootstrap/Pagination";

const Resources = () => {
  const path_image = import.meta.env.VITE_IMAGES_PATH;
  const contentPerPage = 9;
  const { content, fetchAgeGroups, filterAges, filterTag, filterCategory } =
    useContext(ContentContext);
  const [contents, setContents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryTags, setCategoryTags] = useState();
  const [tag, setTag] = useState([]);
  const [category, setCategory] = useState([]);
  const [ageGroup, setAgeGroup] = useState([]);
  const [filters, setFilters] = useState([]);
  const [currentReadClick, setCurrentReadClick] = useState({
    previewArticle: null,
    id: null,
  });
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (filterAges)
      setAgeGroup(
        [...filterAges].sort(
          (a, b) => a.id - b.id
          // b.label.localeCompare(a.label, undefined, { sensitivity: "base" })
        )
      );
    if (filterTag) setTag([...filterTag].sort());
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
    if (contents) setTotalPages(Math.ceil(contents.length / contentPerPage));
  }, [contents]);

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

      const temp = [];
      filteredArray.forEach((element) => {
        let count = 0;
        for (let i = 0; i < filters.length; i++) {
          if (
            filters[i].typ === "age" &&
            element.age_groups.indexOf(filters[i].txt.split("<br />")[1]) !== -1
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
    } else if (filters && filters.length > 0) {
      const temp = [];
      content.forEach((element) => {
        let count = 0;
        for (let i = 0; i < filters.length; i++) {
          if (
            filters[i].typ === "age" &&
            element.age_groups.indexOf(filters[i].txt.split("<br />")[1]) !== -1
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
    else if (typ === "tag") setTag([...tag].filter((tg) => tg !== txt).sort());
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
      setTag([...tag, txt].sort());
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
                  <Form.Control
                    type="search"
                    aria-label="Search"
                    placeholder="Search by tag or content title"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyUp={handleSearchTextKeyUp}
                  />
                  <Button variant="outline-success" onClick={handleSearchClick}>
                    <img src={path_image + "search-icon.svg"} alt="Search" />
                  </Button>
                </Form>
              </div>
              {filters && filters.length > 0 && (
                <div className="tags d-flex">
                  <div className="tag-title">Filters:</div>
                  <div className="tag-list d-flex">
                    {filters.map((fltr, idx) => (
                      <span
                        key={idx}
                        className="badge bg-info me-2"
                        style={{ fontSize: "10px", letterSpacing: 1 }}
                      >
                        {fltr.typ === "age"
                          ? fltr.txt.split("<br />")[1]
                          : fltr.txt}{" "}
                        <button
                          className="btn btn-sm btn-light ms-1"
                          onClick={() =>
                            removeFilters(fltr.txt, fltr.id, fltr.typ)
                          }
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                    tag.map((tags, idx) => (
                      <div
                        className="tag-item"
                        key={idx}
                        style={{ cursor: "pointer" }}
                        onClick={() => selectFilters(tags, 0, "tag")}
                      >
                        {tags}
                      </div>
                    ))}
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
                  {contents && contents.length > 0 ? (
                    contents.map(
                      (section, idx) =>
                        idx >= (activePage - 1) * contentPerPage &&
                        idx < activePage * contentPerPage && (
                          <React.Fragment key={section.id}>
                            <Content
                              section={section}
                              idx={section.id}
                              key={idx}
                              currentReadClick={currentReadClick}
                              setCurrentReadClick={setCurrentReadClick}
                            />
                          </React.Fragment>
                        )
                    )
                  ) : (
                    <div className="no-data-found">No data Found</div>
                  )}
                </div>{" "}
                <div>
                  {totalPages && totalPages > 1 ? (
                    <Pagination>
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
