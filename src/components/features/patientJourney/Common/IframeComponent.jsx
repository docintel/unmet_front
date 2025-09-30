import React from 'react';

const IframeComponent = ({ previewArticle, setCurrentReadClick }) => {
  if (!previewArticle) return null; // Don't render if no URL

  return (
    <div className='w-100'>
      <iframe
        src={previewArticle}
        title="Embedded Content"
        width="100%"
        height="700px"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default IframeComponent;
