"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ items }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSelect = (item) => {
    // this needs to be updated when seperate page for each media is created.
      router.push(`/${item.category}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full px-3 py-2 border rounded shadow-sm"
      />

      {results.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border rounded mt-1 shadow-lg max-h-60 overflow-y-auto z-10">
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                {item.title} <span className="text-xs text-gray-500">({item.year})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
