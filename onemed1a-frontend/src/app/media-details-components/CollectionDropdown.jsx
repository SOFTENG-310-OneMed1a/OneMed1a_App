"use client";

import { useState } from "react";
import PropTypes from "prop-types";

export default function CollectionDropdown({
  userId,
  mediaId,
  mediaType,
  verb = "Watch",
  verb2 = "Watching",
  currentStatus = "Not Added",
  onChange = (newStatus) => console.log("Changed to:", newStatus),
  disabled = false,
  className = "",
}) {
  const OPTIONS = ["Completed", `Planning to ${verb}`, `${verb2}`, "Not Added"];

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  async function handleSelect(option) {
    setStatus(option);
    setOpen(false);

    // Placeholder API request simulation
    console.log("Simulated API call:", {
      userId,
      mediaId,
      mediaType,
      status: option,
    });

    // Simulate a delay for "network request"
    await new Promise((resolve) => setTimeout(resolve, 300));

    onChange(option);
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
  userId: PropTypes.string,
  mediaId: PropTypes.string,
  mediaType: PropTypes.string,
  currentStatus: PropTypes.string,
  verb: PropTypes.string,
  verb2: PropTypes.string,
  onChange: PropTypes.func,
};
