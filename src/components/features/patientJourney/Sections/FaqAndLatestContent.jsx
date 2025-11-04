import React, { useState } from "react";
import Content from "../Common/Content";
import FixedSizeList from "../Common/FixedSizedList";

const FaqAndLatestContent = ({ content, isFaq }) => {
  // const [currentReadClick, setCurrentReadClick] = useState({
  //   previewArticle: null,
  //   id: null,
  // });

  const path_image = import.meta.env.VITE_IMAGES_PATH;
  return (
    <div className="touchpoint-data-boxes">
      {content ? (
        content && (
          <FixedSizeList items={content} itemCount={9} favTab={false} />
        )
      ) : (
        // content.map((section, idx) => (
        //   <React.Fragment key={section.id}>
        //     <Content
        //       section={section}
        //       key={idx}
        //       idx={section.id}
        //       favTab={false}
        //     />
        //   </React.Fragment>
        // ))
        <div className="no_data_found">No data Found</div>
      )}
    </div>
  );
};

export default FaqAndLatestContent;
