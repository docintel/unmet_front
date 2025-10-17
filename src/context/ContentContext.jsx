import { createContext, useEffect, useState } from "react";
import {
  fetchAgeGroupCategories,
  fetchContentList,
  fetchNarrativeList,
} from "../services/touchPointServices";

import Loader from "../components/features/patientJourney/Common/Loader";

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [contents, setContents] = useState(null);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterAges, setFilterAges] = useState([]);
  const [filterTag, setFilterTag] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [narrative, setNarrative] = useState([]);
  const [isHcp, setIsHcp] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [toast, setToast] = useState({
    type: null,
    title: null,
    message: null,
    show: false,
  });

  useEffect(() => {
    document.cookie.split(";").forEach((item) => {
      let hcpArr = item.split("=");
      if (hcpArr[0].trim() == "isHcp") {
        setIsHcp(JSON.parse(hcpArr[1]));
      }
    });

    (async () => {
      const cntnts = (await fetchContentList(setIsLoading, setToast)).contents;
      if (cntnts) {
        setContents(cntnts);
      }
    })();
  }, []);

  useEffect(() => {
    if (contents) {
      const filteredList = [];
      let tagArray = [];
      contents.map((item) => {
        if (isHcp && item.hide_in_hcp == "1") return;
        try {
          if (item.tags !== "")
            tagArray = [...tagArray, ...JSON.parse(item.tags)];
        } catch (ex) {}

        filteredList.push(item);
      });

      const freqMap = {};
      for (const word of tagArray) {
        freqMap[word] = (freqMap[word] || 0) + 1;
      }

      const uniqueWords = Object.keys(freqMap);
      uniqueWords.sort((a, b) => {
        const freqDiff = freqMap[b] - freqMap[a];
        if (freqDiff !== 0) return freqDiff;
        return a.localeCompare(b);
      });

      setFilterTag(uniqueWords);
      setContent(filteredList);
    }
  }, [contents, isHcp]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      isHcp ? "dark" : "light"
    );
  }, [isHcp]);

  const fetchAgeGroups = async () => {
    if (
      filterAges.length == 0 &&
      categoryList.length == 0 &&
      filterCategory.length == 0
    ) {
      const { ageGroups, category, contentCategory } =
        await fetchAgeGroupCategories(setIsLoading, setToast);
      setFilterCategory(category);
      setFilterAges(ageGroups);
      setCategoryList(contentCategory);
    }
  };

  const getNarratives = async (isAllSelected) => {
    if (narrative.length == 0) {
      const { narratives } = await fetchNarrativeList(
        isAllSelected,
        setIsLoading,
        setToast
      );
      setNarrative(narratives);
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
        isHcp,
        categoryList,
        toast,
        updateRating,
        setIsLoading,
        fetchAgeGroups,
        getNarratives,
        setIsHcp,
        setToast,
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
