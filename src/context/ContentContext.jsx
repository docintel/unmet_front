import { createContext, useEffect, useState } from "react";
import
{
  fetchAgeGroupCategories,
  fetchContentList,
  fetchNarrativeList,
} from "../services/touchPointServices";
import Loader from "../components/features/patientJourney/Common/Loader";
export const ContentContext = createContext();

export const ContentProvider = ({ children }) =>
{
  const [contents, setContents] = useState([]);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterAges, setFilterAges] = useState([]);
  const [filterTag, setFilterTag] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [narrative, setNarrative] = useState([]);
  const [isHcp, setIsHcp] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [toast, setToast] = useState({ type: null, title: null, message: null, show: false });

  useEffect(() =>
  {
    (async () =>
    {
      setIsLoading(true);
      const cntnts = (await fetchContentList()).contents;
      if (cntnts) {
        setContents(cntnts);
      }
      setIsLoading(false);
    })();
  }, []);

  useEffect(() =>
  {
    if (contents && contents.length > 0) {
      const filteredList = [];
      let tagArray = [];
      contents.map((item) =>
      {
        if (isHcp && item.hide_in_hcp == "1") return;
        tagArray = [...tagArray, ...JSON.parse(item.tags)];
        filteredList.push(item);
      });

      const freqMap = {};
      for (const word of tagArray) {
        freqMap[word] = (freqMap[word] || 0) + 1;
      }

      const uniqueWords = Object.keys(freqMap);
      uniqueWords.sort((a, b) =>
      {
        const freqDiff = freqMap[b] - freqMap[a];
        if (freqDiff !== 0) return freqDiff;
        return a.localeCompare(b);
      });

      setFilterTag(uniqueWords);
      setContent(filteredList);
    }
  }, [contents, isHcp]);

  const fetchAgeGroups = async () =>
  {
    if (
      filterAges.length == 0 &&
      filterTag.length == 0 &&
      filterCategory.length == 0
    ) {
      setIsLoading(true);
      const { ageGroups, category, contentCategory } =
        await fetchAgeGroupCategories();
      setFilterCategory(category);
      setFilterAges(ageGroups);
      setCategoryList(contentCategory);
      setIsLoading(false);
    }
  };

  const getNarratives = async (isAllSelected) =>
  {
    if (narrative.length == 0) {
      setIsLoading(true);
      const { narratives } = await fetchNarrativeList(isAllSelected);
      setNarrative(narratives);
      setIsLoading(false);
    }
  };

  const updateRating = (id, rating) =>
  {
    setContent((prevContent) =>
      prevContent.map((cntnt) =>
      {
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
        categoryList, toast,
        updateRating,
        setIsLoading,
        fetchAgeGroups,
        getNarratives,
        setIsHcp, setToast
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
