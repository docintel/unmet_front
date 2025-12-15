import { createContext, useEffect, useState } from "react";
import {
  fetchAgeGroupCategories,
  fetchContentList,
  fetchNarrativeList,
} from "../services/touchPointServices";

import Loader from "../components/features/patientJourney/Common/Loader";
import endPoint from "../services/axios/apiEndpoint";
import { getData } from "../services/axios/apiHelper";

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
  const [currentTabValue, setCurrentTabValue] = useState("");
  const [contentHolder, setContentHolder] = useState("");
  const [favorite, setFavorite] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    document.cookie.split(";").forEach((item) => {
      let hcpArr = item.split("=");
      if (hcpArr[0].trim() == "isHcp") {
        setIsHcp(JSON.parse(hcpArr[1]) || false);
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
            tagArray = [
              ...tagArray,
              ...JSON.parse(item.tags || "[]"),
              ...JSON.parse(item.functional_tags || "[]").map(
                (tag) => "prefix_" + tag
              ),
            ];
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

  const getAccountData = async () => {
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

  const updateRating = (id, rating, self_rate) => {
    setContent((prevContent) => {
      return {
        loading: false,
        error: false,
        data: prevContent.data.map((cntnt) => {
          if (cntnt.id === id) {
            return {
              ...cntnt,
              ...{ self_rate: self_rate, rating: rating },
            };
          } else return cntnt;
        }),
      };
    });

    if (recentContent.length > 0) {
      setRecentContent((prev) => {
        const filteredArr = prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              self_rate: self_rate,
              rating: rating,
            };
          } else return item;
        });
        return filteredArr;
      });
    }

    let exists = false;
    favorite.map((item) => {
      if (item.id === id) exists = true;
    });
    if (exists) {
      setFavorite((prev) => prev.filter((item) => item.id !== id));
    } else {
      const cntnt = content.data.filter((item) => item.id === id);
      setFavorite((prev) => [
        {
          ...cntnt[0],
          self_rate: self_rate,
          rating: rating,
        },
        ...prev,
      ]);
    }
  };

  const updateDownload = () => {
    setUserData((prev) => {
      return {
        ...prev,
        total_download: prev?.total_download ? prev?.total_download + 1 : 1,
      };
    });
  };

  const updateContentShared = () => {
    setUserData((prev) => {
      return {
        ...prev,
        total_shared: prev?.total_shared ? prev.total_shared + 1 : 1,
      };
    });
  };

  const updateUserPorfileData = (name, role, country,region) => {
    setUserData((prev) => ({
      ...prev,
      name: name,
      role: role,
      country: country,
      region: region,
    }));
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
        currentTabValue,
        favorite,
        recentContent,
        userData,
        contentHolder,
        setContentHolder,
        setCurrentTabValue,
        updateRating,
        setIsLoading,
        fetchAgeGroups,
        getNarratives,
        setIsHcp,
        setToast,
        getAccountData,
        updateDownload,
        updateContentShared,
        updateUserPorfileData,
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
