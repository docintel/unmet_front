import React, { createContext, useEffect, useState } from "react";
import {
  fetchAgeGroupCategories,
  fetchContentList,
  fetchNarrativeList,
} from "../services/touchPointServices";
import Loader from "../components/features/patientJourney/Common/Loader";
export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterAges, setFilterAges] = useState([]);
  const [filterTag, setFilterTag] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [narrative, setNarrative] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { contents } = await fetchContentList();

      setContent(contents);
      setIsLoading(false);
    })();
  }, []);

  const fetchAgeGroups = async () => {
    if (
      filterAges.length == 0 &&
      filterTag.length == 0 &&
      filterCategory.length == 0
    ) {
      setIsLoading(true);
      const { ageGroups, category, tags } = await fetchAgeGroupCategories();
      setFilterCategory(category);
      setFilterTag(tags);
      setFilterAges(ageGroups);
      setIsLoading(false);
    }
  };

  const getNarratives = async (isAllSelected) => {
    if (narrative.length == 0) {
      setIsLoading(true);
      const { narratives } = await fetchNarrativeList(isAllSelected);
      setNarrative(narratives);
      setIsLoading(false);
    }
  };

  const updateRating = (id, rating) => {
    setContent((prevContent) =>
      prevContent.map((cntnt) => {
        if (cntnt.id === id) {
          return {
            ...cntnt,
            ...{ self_rate: cntnt.self_rate === 1 ? 0 : 1, rating: rating },
          };
        } else return cntnt;
      })
    );
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        filterAges,
        filterTag,
        filterCategory,
        narrative,
        updateRating,
        setIsLoading,
        fetchAgeGroups,
        getNarratives,
      }}
    >
      {" "}
      <div style={{ display: isLoading ? "block" : "none" }}>
        <div className="loader-overlay">
          <Loader />
        </div>
      </div>
      {children}
    </ContentContext.Provider>
  );
};
