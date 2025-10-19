/**
 * mediaUtils.js - Utility functions for media data handling
 * Includes:
 * - Image URL construction
 * - Media type normalization and mapping
 * - Year extraction
 * - Cover image selection
 * - Generic JSON fetcher
 */

// --- Image helpers ---------------------------------------------------------
export const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/";

// Normalize media type keys from route or API
export const normalizeTypeKey = (t = "") => {
  const key = String(t).toLowerCase();
  if (key === "movie") return "movie";
  if (key === "tv") return "tv";
  if (key === "music" || key === "audio") return "music";
  if (key === "books" || key === "book") return "books";
  return key;
};

// Map normalized key -> backend type
export const typeMap = {
  movie: "MOVIE",
  tv: "TV",
  music: "MUSIC",
  books: "BOOKS",
};

/**
 * Extract the year from a date string.
 */
export const toYear = (dateStr) =>
  dateStr ? Number(String(dateStr).slice(0, 4)) : undefined;

/** Check if a URL is fully qualified */
export function isFullUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

/**
 * Get a resized image URL for TMDB-like paths or return full URLs as is.
 */
export function withSize(path, size = "w500") {
  if (!path) return null;
  if (isFullUrl(path)) return path;
  const p = String(path).startsWith("/") ? String(path) : `/${path}`;
  return `${TMDB_IMG_BASE}${size}${p}`;
}

/**
 * Get the appropriate cover image URL (poster preferred, then backdrop, else placeholder).
 */
export function pickCover(
  posterPath,
  backdropPath,
  posterSize = "w342",
  backdropSize = "w780",
  base = TMDB_IMG_BASE
) {
  if (posterPath)
    return isFullUrl(posterPath)
      ? posterPath
      : `${base}${posterSize}${
          posterPath.startsWith("/") ? posterPath : "/" + posterPath
        }`;
  if (backdropPath)
    return isFullUrl(backdropPath)
      ? backdropPath
      : `${base}${backdropSize}${
          backdropPath.startsWith("/") ? backdropPath : "/" + backdropPath
        }`;
  return "/placeholder-movie.png";
}

/**
 * Generic JSON fetcher for backend API calls.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
export async function fetchJSON(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...options, // <-- forward headers, method, etc.
  });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status}`);
  }
  return res.json();
}
