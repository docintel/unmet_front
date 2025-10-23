import { createContext, useEffect, useState } from "react";
import {
  fetchAgeGroupCategories,
  fetchContentList,
  fetchNarrativeList,
} from "../services/touchPointServices";

import Loader from "../components/features/patientJourney/Common/Loader";

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [contents, setContents] = useState({
    loading: false,
    error: false,
    data: [],
  });
  const [content, setContent] = useState({
    loading: false,
    error: false,
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filterAges, setFilterAges] = useState({
    loading: false,
    error: false,
    data: [],
  });
  const [filterTag, setFilterTag] = useState([]);
  const [filterCategory, setFilterCategory] = useState({
    loading: false,
    error: false,
    data: [],
  });
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
      await fetchContentList(setIsLoading, setToast, setContents);
    })();
  }, []);

  useEffect(() => {
    if (contents.data.length > 0) {
      const filteredList = [];
      let tagArray = [];
      contents.data.map((item) => {
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
      setContent({
        loading: false,
        error: false,
        data: filteredList,
      });
    } else {
      setContent(contents);
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
      filterAges.data.length == 0 &&
      categoryList.length == 0 &&
      filterCategory.data.length == 0
    ) {
      const { contentCategory } = await fetchAgeGroupCategories(
        setIsLoading,
        setToast,
        setFilterCategory,
        setFilterAges
      );
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
    setContent((prevContent) => {
      return {
        loading: false,
        error: false,
        data: prevContent.data.map((cntnt) => {
          if (cntnt.id === id) {
            return {
              ...cntnt,
              ...{ self_rate: cntnt.self_rate === 1 ? 0 : 1, rating: rating },
            };
          } else return cntnt;
        }),
      };
    });
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
