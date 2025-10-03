import { useEffect, useState } from "react";
import FaqAndLatestContent from "./FaqAndLatestContent";
import { useContext } from "react";
import { ContentContext } from "../../../../context/ContentContext";

const Faq = () => {
  const { content } = useContext(ContentContext);
  const [faqContent, setFaqContent] = useState([]);

  useEffect(() => {
    if (content.length === 0) return;
    const filteredData = content.filter((item) => {
      const categoryLower = item.category.toLowerCase();
      return categoryLower === "faq";
    });
    setFaqContent(filteredData);
  }, []);
  return (
    <>
      {faqContent.length > 0 ? (
        <FaqAndLatestContent content={faqContent} isFaq={true} />
      ) : (
        <div className="no-data-found">No data Found</div>
      )}
    </>
  );
};

export default Faq;
