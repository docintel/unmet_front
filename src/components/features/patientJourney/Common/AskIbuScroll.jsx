import React, { useRef, useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";

const AskIbuScroll = ({ items, itemCount, account }) => {
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
      className=""
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {items &&
        items.length > 0 &&
        items
          .slice(0, itemsToShow)
          .map((item) => {
            return (
              <React.Fragment key={item.id}>
                <QuestionCard question={item} account={account} />
              </React.Fragment>
            );
          })}{" "}
    </div>
  );
};

export default AskIbuScroll;
