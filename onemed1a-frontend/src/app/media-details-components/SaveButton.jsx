"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export default function SaveButton({
  userId,
  mediaId, // The actual media ID (TMDB, etc.) - for saving
  statusId, // The user media status ID - for deletion
  mediaType = "movie",
  onRemove,
  saved: initialSaved = false,
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(initialSaved);

  // Sync with initialSaved prop when it changes
  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  async function handleToggle() {
    setSaving(true);
    try {
      if (!saved) {
        // Save logic
        const payload = {
          userId,
          mediaId, // This is the actual media ID
          type: mediaType.toUpperCase(),
          status: "PLAN_TO_WATCH",
        };

        console.log("Saving media:", payload);

        const res = await fetch(`${API_BASE}/api/v1/usermedia`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const savedItem = await res.json();
          console.log("Save successful:", savedItem);
          setSaved(true);
        } else {
          const err = await res.text();
          console.error("Save failed", res.status, err);
        }
      } else {
        // Remove from list - MUST use statusId for deletion
        console.log("Deleting with statusId:", statusId);

        if (!statusId) {
          console.error("No statusId provided for deletion");
          return;
        }

        const res = await fetch(`${API_BASE}/api/v1/usermedia/${statusId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          console.log("Delete successful");
          setSaved(false);
          if (onRemove) onRemove(); // Call the parent's remove function
        } else {
          const err = await res.text();
          console.error("Remove failed", res.status, err);
        }
      }
    } catch (err) {
      console.error("Error in handleToggle:", err);
    } finally {
      setSaving(false);
    }
  }

  // Simple button text based on state
  const buttonText = saving
    ? "Saving..."
    : saved
    ? `Remove from My ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`
    : `Save to My ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`;

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={`rounded-xl text-white px-4 py-2 mt-4 transition-all min-w-[160px] ${
        saved ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
      } disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
    >
      {buttonText}
    </button>
  );
}
