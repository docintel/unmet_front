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

  return (
    <ContentContext.Provider value={{ content }}>
      {children}
    </ContentContext.Provider>
  );
};
