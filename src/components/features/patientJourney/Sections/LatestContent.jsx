import React, { useEffect, useState, useContext } from "react";
import FaqAndLatestContent from "./FaqAndLatestContent";
import { ContentContext } from "../../../../context/ContentContext";

const LatestContent = () => {
  const { content } = useContext(ContentContext);
  const [latestContent, setLatestContent] = useState([]);

  useEffect(() => {
    if (content.length === 0) return;
    const sortedData = content.sort((a, b) => {
      const dateA = new Date(a.creation_date.split(".").reverse().join("-")); // "25.September.2025" -> "2025-September-25"
      const dateB = new Date(b.creation_date.split(".").reverse().join("-"));
      return dateB - dateA; // latest first
    });

    setLatestContent(sortedData);
  }, []);

  return (
    <>
      {latestContent.length > 0 ? (
        <FaqAndLatestContent content={latestContent} isFaq={false} />
      ) : (
        <div className="no-data-found">No data Found</div>
      )}
    </>
  );
};

export default LatestContent;
