"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Card from "./Card";

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

export default function MediaGrid({ items, pageSize = DEFAULT_PAGE_SIZE }) {
  const data = Array.isArray(items) ? items : [];
  const [visibleCount, setVisibleCount] = useState(
    Math.min(pageSize, data.length)
  );
  const [cols, setCols] = useState(2);
  const sentinelRef = useRef(null);

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
          prev >= data.length ? prev : Math.min(prev + pageSize, data.length)
        );
      },
      { rootMargin: OBS_ROOT_MARGIN }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [data.length, pageSize]);

  // Column count from window width (no addListener/removeListener)
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

  // Distribute by row (i % cols), then render as column stacks
  const columns = useMemo(() => {
    const buckets = Array.from({ length: cols }, () => []);
    const count = Math.min(visibleCount, data.length);
    for (let i = 0; i < count; i += 1) {
      const it = data[i];
      if (it) buckets[i % cols].push(it);
    }
    return buckets;
  }, [data, visibleCount, cols]);

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
                <Card key={`${ci}-${idx}-${item.id}`} item={item} />
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
  items: PropTypes.arrayOf(Card.propTypes.item).isRequired,
  pageSize: PropTypes.number,
};

MediaGrid.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE,
};
