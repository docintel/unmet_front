import React, { useRef, useState, useEffect } from "react";
import Content from "./Content";

const FixedSizeList = ({ items, itemCount, favTab }) => {
  const containerRef = useRef(null);
  const [itemsToShow, setItemsToShow] = useState(
    Math.min(itemCount, items.length)
  );

  useEffect(() => {
    setItemsToShow((prev) => Math.min(itemCount, items.length));
  }, [items]);

  useEffect(() => {
    if (!containerRef) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.intersectionRatio === 1) {
          setItemsToShow((prev) => Math.min(prev + itemCount, items.length));
        }
      },
      {
        threshold: 1.0,
        root: null,
      }
    );
    observer.observe(containerRef.current.lastElementChild);

    return () => observer.disconnect();
  }, [items, itemsToShow]);

  return (
    <div
      className="touchpoint-data-boxes"
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {items &&
        items.length > 0 &&
        items
          .sort(
            (a, b) =>
              new Date(b.creation_date.replaceAll(".", " ")) -
              new Date(a.creation_date.replaceAll(".", " "))
          )
          .slice(0, itemsToShow)
          .map((item) => {
            return (
              <React.Fragment key={item.id}>
                <Content
                  section={item}
                  idx={item.id}
                  key={item.id}
                  favTab={favTab}
                />
              </React.Fragment>
            );
          })}{" "}
    </div>
  );
};

export default FixedSizeList;
