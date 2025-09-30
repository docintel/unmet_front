import React, { createContext, useEffect, useState } from "react";
import { fetchContentList } from "../services/touchPointServices";

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    (async () => {
      const { contents } = await fetchContentList();
      setContent(contents);
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
    <ContentContext.Provider value={{ content, updateRating }}>
      {children}
    </ContentContext.Provider>
  );
};
