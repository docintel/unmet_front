import React, { createContext, useEffect, useState } from "react";
import { fetchContentList } from "../services/touchPointServices";
import Loader from "../components/features/patientJourney/Common/Loader";
export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { contents } = await fetchContentList();
      setContent(contents);
      setIsLoading(false);
    })();
  }, []);

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
    <ContentContext.Provider value={{ content, updateRating, setIsLoading }}>
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
