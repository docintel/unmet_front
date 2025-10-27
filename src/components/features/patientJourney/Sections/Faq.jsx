import { useEffect, useState } from "react";
import FaqAndLatestContent from "./FaqAndLatestContent";
import { useContext } from "react";
import { ContentContext } from "../../../../context/ContentContext";

const Faq = () => {
  const { content } = useContext(ContentContext);
  const [faqContent, setFaqContent] = useState([]);

  useEffect(() => {
    if (content.loading || content.error) return;

    const filteredData = content.data.filter((item) => {
      const categoryLower = item.category.toLowerCase();
      return categoryLower === "faq";
    });
    setFaqContent(filteredData);
  }, [content]);
  return (
    <>
      {faqContent.length > 0 ? (
        <FaqAndLatestContent content={faqContent} isFaq={true} />
      ) : (
        <div className="no_data_found">No data Found</div>
      )}
    </>
  );
};

export default Faq;
