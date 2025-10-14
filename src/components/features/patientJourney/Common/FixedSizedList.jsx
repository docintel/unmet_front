import React, { useRef, useState, useEffect } from "react";

const FixedSizeList = ({
  itemCount,
  itemSize,
  renderItem,
  overscanCount = 5,
}) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const totalHeight = itemCount * itemSize;

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollOffset(containerRef.current.scrollTop);
    }
  };

  // ResizeObserver to get dynamic height
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const startIndex = Math.floor(scrollOffset / itemSize);
  const visibleCount = Math.ceil(containerHeight / itemSize);
  const endIndex = Math.min(
    itemCount,
    startIndex + visibleCount + overscanCount
  );

  const items = [];
  for (let i = Math.max(0, startIndex - overscanCount); i < endIndex; i++) {
    items.push(renderItem(i, {}));
  }

  return (
    <div
      className="touchpoint-data-boxes"
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {items}
    </div>
  );
};

export default FixedSizeList;
