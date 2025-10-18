"use client";
import { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

/**
 * Card component to display media item information.
 */
export default function Card({ item }) {
  const [loaded, setLoaded] = useState(false);
  // Use coverUrl, fallback to posterUrl, fallback to /next.svg
  const src = item.coverUrl || item.posterUrl || "/next.svg";

  const hasHref = typeof item.href === "string" && item.href.trim().length > 0;
  // Use id, fallback to externalMediaId
  const id = item.id || item.externalMediaId;
  const targetHref = hasHref ? item.href : `/collection/${item.type}/${id}`;

  // Wrapper classes for the card link
  const wrapperClasses =
    "block min-h-[44px] min-w-[44px] overflow-hidden group " +
    "rounded-xl bg-[color:var(--card)] text-[color:var(--card-foreground)] " +
    "shadow-xl shadow-[color:var(--shadow,rgba(0,0,0,.35))] transition " +
    "hover:shadow-2xl hover:shadow-[color:var(--shadow,rgba(0,0,0,.55))] " +
    "focus:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[color:var(--ring,#2563eb)] " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ring-offset,transparent)] " +
    "active:scale-[0.99] motion-safe:transition-transform";

  const content = (
    <>
      <div className="relative w-full aspect-[2/3]">
        {/* Image container */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          {!loaded && (
            <div
              className="h-full w-full animate-pulse bg-[color:var(--skeleton,#e5e7eb)]"
              aria-hidden="true"
            />
          )}

          {/* Use a plain <img> to guarantee painting in dev */}
          <img
            src={src}
            alt=""
            width={400}
            height={600}
            className={`h-full w-full object-cover ${
              loaded ? "block" : "hidden"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        </div>

        {/* Overlay with title and info - appears only on hover */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t from-black/90 via-black/50 to-transparent
            opacity-0 transition-opacity duration-200
            group-hover:opacity-100 group-focus-within:opacity-100
            rounded-xl
          "
          aria-hidden="true"
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white">
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-1">
                {item.title}
              </h3>
              {(item.year || item.type || item.rating) && (
                <p className="text-xs leading-5 text-gray-200 truncate">
                  {[item.year, item.type, item.rating]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Show more info on focus/hover */}
      <div className="sr-only">
        {item.title} {item.year ? `(${item.year})` : ""}
      </div>
    </>
  );

  // Wrap exactly once (no nested links)
  return (
    <Link
      href={targetHref}
      aria-label={`${item.title}${item.year ? ` (${item.year})` : ""}`}
      className={wrapperClasses}
    >
      {content}
    </Link>
  );
}

Card.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    externalMediaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    coverUrl: PropTypes.string,
    posterUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    href: PropTypes.string,
  }).isRequired,
};
