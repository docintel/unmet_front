import React, { useContext } from "react";
import { ContentContext } from "../../../../context/ContentContext";

const IframeComponent = ({ previewArticle /* setCurrentReadClick */ }) =>
{
  if (!previewArticle) return null;

  const { isHcp } = useContext(ContentContext);
  console.log(previewArticle, "previewArticle")

  return (
    <div className="w-100">
      <iframe
        src={previewArticle.replace("https://docintel.app", "http://localhost:4200") + (isHcp ? "_codeHcp" : "_codeOcta")}
        // src={previewArticle + (isHcp ? "_codeHcp" : "_codeOcta")}
        title="Embedded Content"
        width="100%"
        height="100%"
        style={{
          border: "none",
          minHeight: "100vh",
        }}
      ></iframe>
    </div>
  );
};

export default IframeComponent;
