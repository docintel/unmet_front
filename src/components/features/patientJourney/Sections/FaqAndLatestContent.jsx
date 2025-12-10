import FixedSizeList from "../Common/FixedSizedList";

const FaqAndLatestContent = ({ content, isFaq ,itemSize }) => {

  const path_image = import.meta.env.VITE_IMAGES_PATH;
  return (
    <div className="touchpoint-data-boxes">
      {content ? (
        content && (
          <FixedSizeList
            items={content}
            itemCount={itemSize}
            favTab={false}
            sortingAllowed={true}
          />
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
