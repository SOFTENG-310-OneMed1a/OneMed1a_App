"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Card from "./Card";

/**
 * MediaGrid component to display a grid of media items (in Card) with infinite scroll.
 */

const DEFAULT_PAGE_SIZE = 40;
const OBS_ROOT_MARGIN = "800px 0px";

/** Compute cols from width (no matchMedia -> no deprecated listeners) */
function colsFromWidth(w) {
  if (w >= 1280) return 6;
  if (w >= 1024) return 5;
  if (w >= 768) return 4;
  if (w >= 640) return 3;
  return 2;
}

export default function MediaGrid({
  items,
  pageSize = DEFAULT_PAGE_SIZE,
  onRemove,
  userId,
}) {
  const data = Array.isArray(items) ? items : [];
  const [visibleCount, setVisibleCount] = useState(
    Math.min(pageSize, data.length)
  );
  const [cols, setCols] = useState(2);
  const sentinelRef = useRef(null);
  const [internalItems, setInternalItems] = useState(data);

  // Get userId from cookies (client-side)
  const getUserId = () => {
    if (typeof document === "undefined") return null;
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith("userId="))
      ?.split("=")[1];
  };

  // Sync internalItems if `items` prop changes
  useEffect(() => {
    setInternalItems(data);
    setVisibleCount(Math.min(pageSize, data.length));
  }, [data, pageSize]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (
      !el ||
      typeof window === "undefined" ||
      !("IntersectionObserver" in window)
    )
      return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisibleCount((prev) =>
          prev >= internalItems.length
            ? prev
            : Math.min(prev + pageSize, internalItems.length)
        );
      },
      { rootMargin: OBS_ROOT_MARGIN }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [internalItems.length, pageSize]);

  // Column count from window width
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setCols(colsFromWidth(window.innerWidth));
    update();
    let t = null;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(update, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Callback to remove item locally
  const handleRemove = (id) => {
    console.log("Removing item with id:", id);
    setInternalItems((prev) => prev.filter((item) => item.id !== id));
    if (onRemove) onRemove(id);
  };

  // Distribute by row (i % cols)
  const columns = useMemo(() => {
    const buckets = Array.from({ length: cols }, () => []);
    const count = Math.min(visibleCount, internalItems.length);
    for (let i = 0; i < count; i += 1) {
      const it = internalItems[i];
      if (it) buckets[i % cols].push(it);
    }
    return buckets;
  }, [internalItems, visibleCount, cols]);

  const gridCols =
    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";

  return (
    <>
      <div className={gridCols}>
        {columns.map((col, ci) => {
          const firstId = col[0]?.id ?? "none";
          const lastId = col[col.length - 1]?.id ?? "none";
          const colKey = `col-${ci}-${firstId}-${lastId}-${col.length}`;

          return (
            <div key={colKey} className="flex flex-col gap-4">
              {col.map((item, idx) => (
                <Card
                  key={item.id}
                  item={item}
                  saved={true} // These are already saved items
                  onRemove={() => handleRemove(item.id)}
                  userId={userId}
                  statusId={item.id} // This is the user media status ID for deletion
                  mediaId={item.externalMediaId} // This is the actual media ID (TMDB, etc.)
                  mediaType={item.type}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div ref={sentinelRef} />
    </>
  );
}

MediaGrid.propTypes = {
  items: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  onRemove: PropTypes.func,
};

MediaGrid.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE,
};
