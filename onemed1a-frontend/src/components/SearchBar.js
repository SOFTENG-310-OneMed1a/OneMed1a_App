"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function SearchBar({ items }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const timerRef = useRef(null);
  const router = useRouter();

  const mapTypeToCategory = (type) => (typeof type === "string" ? type.toLowerCase() : "");

  const fetchSuggestions = async (value) => {
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    try {
      const url = `${API_BASE}/media/search?q=${encodeURIComponent(value)}&size=5&sort=title,asc`;
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // If backend returns a Spring Page, pull from 'content'; otherwise treat as array.
      const content = Array.isArray(data) ? data : data?.content ?? [];
      const mapped = content.map((m) => ({
        id: m.id ?? m.mediaId ?? m.id,
        title: m.title,
        year: m.releaseDate?.toString().slice(0, 4),
        category: mapTypeToCategory(m.type),
      }));
      setResults(mapped);
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error("Suggest failed:", e);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim() || value.trim().length < 2) {
      setResults([]);
      return;
    }

    // Debounce 250ms to avoid spamming the backend
    timerRef.current = setTimeout(() => {
      if (items && Array.isArray(items) && items.length) {
        // Optional local fallback dataset
        const filtered = items
          .filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5);
        setResults(filtered);
      } else {
        // Default: query backend
        fetchSuggestions(value);
      }
    }, 250);
  };

  const handleSelect = (item) => {
    // TODO: when media detail pages exist, use `/media/${item.id}`
    if (item?.category) {
      router.push(`/${item.category}`);
    } else {
      router.push(`/search?query=${encodeURIComponent(item.title)}`);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full px-3 py-2 border rounded shadow-sm"
        aria-autocomplete="list"
        aria-expanded={results.length > 0}
        aria-controls="search-suggest"
      />

      {results.length > 0 && (
        <ul
          id="search-suggest"
          className="absolute left-0 right-0 bg-white border rounded mt-1 shadow-lg max-h-60 overflow-y-auto z-10"
        >
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                {item.title}{" "}
                {item.year ? (
                  <span className="text-xs text-gray-500">({item.year})</span>
                ) : null}
              </button>
            </li>
          ))}
          {loading && (
            <li className="px-3 py-2 text-xs text-gray-500">Searching…</li>
          )}
        </ul>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  // Optional local fallback dataset; otherwise pulls from backend
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      category: PropTypes.string,
    })
  ),
};
