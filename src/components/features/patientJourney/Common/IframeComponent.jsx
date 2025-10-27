import React, { useContext } from "react";
import { ContentContext } from "../../../../context/ContentContext";

const IframeComponent = ({ previewArticle /* setCurrentReadClick */ }) => {
  if (!previewArticle) return null;

  const { isHcp } = useContext(ContentContext);

  return (
    <div className="w-100">
      <iframe
        src={previewArticle + (isHcp ? "_codeHcp" : "_codeOcta")}
        title="Embedded Content"
        width="100%"
        height="100%"
        style={{
          border: "none",
          minHeight: "85vh",
        }}
      ></iframe>
    </div>
  );
};

export default IframeComponent;
