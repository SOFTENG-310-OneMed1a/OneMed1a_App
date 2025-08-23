"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { uppsertMediaStatus } from "@/api/mediaStatusApi";
import { cookies } from "next/headers";

export default function CollectionDropdown({
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
  const [userId, setUserId] = useState(null);
  const [id, setId] = useState(null);

  // ✅ Load userId and id on mount
  useEffect(() => {
    async function fetchUserAndId() {
      try {
        // Example API call to get user + id
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;
        console.log(userId);
        const { id } = await params;
        setUserId(userId);
        setId(id); 
      } catch (err) {
        console.error("Failed to fetch session info:", err);
      }
    }

    fetchUserAndId();
  }, []);

  // ✅ Sync status to backend whenever it changes
  useEffect(() => {
    if (!userId || !id) return;
    if (status === "Not Added") {
      console.log("Delete not implemented for backend yet");
      return;
    }

    async function updateStatus() {
      try {
        await uppsertMediaStatus({
          userId,
          id,
          mediaType,
          status,
        });
        onChange(status);
      } catch (err) {
        console.error("Failed to update status:", err);
      }
    }

    updateStatus();
  }, [status, userId, id, mediaType, onChange]);

  function handleSelect(option) {
    setStatus(option);
    setOpen(false);
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
  mediaType: PropTypes.string.isRequired,
  currentStatus: PropTypes.string,
  verb: PropTypes.string,
  verb2: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
