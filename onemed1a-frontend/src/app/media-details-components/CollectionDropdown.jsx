"use client";

import { useState } from "react";
import PropTypes from "prop-types";

export default function CollectionDropdown({
  userId,
  mediaId,
  mediaType,
  verb = "placeholder",
  verb2 = "placeholder2",
  currentStatus = "Not Added",
  onChange = (newStatus) => console.log("Changed to:", newStatus),
  disabled = false,
  className = "",
}) {
  // Define verbs based on media type

  const OPTIONS = ["Completed", `Planning to ${verb}`, `${verb2}`, "Not Added"];

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  async function handleSelect(option) {
    setStatus(option);
    setOpen(false);

    // Call backend API (replace URL with your endpoint)
    try {
      const res = await fetch("/api/user-media-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          mediaId,
          mediaType,
          status: option,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      onChange(option); // optional callback
    } catch (err) {
      console.error(err);
    }
  }

  const baseBtn =
    "rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-neutral-100 " +
    "ring-1 ring-neutral-800 shadow-sm transition hover:bg-neutral-800 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 " +
    "disabled:opacity-60 disabled:cursor-not-allowed w-48 text-left";

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={baseBtn}
      >
        {status}
        <span className="float-right ml-2">▼</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white text-black rounded shadow-lg">
          {OPTIONS.map((option) => (
            <li key={option}>
              <button
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 ${
                  option === status ? "font-bold" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

CollectionDropdown.propTypes = {
  userId: PropTypes.string.isRequired,
  mediaId: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  currentStatus: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
