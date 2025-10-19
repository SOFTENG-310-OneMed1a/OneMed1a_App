"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export default function SaveButton({
  userId,
  mediaId,
  statusId,
  mediaType = "movie",
  onRemove,
  saved: initialSaved = false,
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(initialSaved);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  // Debug props
  useEffect(() => {
    console.log("SaveButton props:", {
      userId,
      mediaId,
      statusId,
      mediaType,
      initialSaved,
      saved,
    });
  }, [userId, mediaId, statusId, mediaType, initialSaved, saved]);

  async function handleToggle() {
    setSaving(true);
    try {
      if (!saved) {
        // Save logic
        const payload = {
          userId,
          mediaId,
          type: mediaType.toUpperCase(),
          status: "PLAN_TO_WATCH",
        };

        console.log("Saving with payload:", payload);

        const res = await fetch(`${API_BASE}/api/v1/usermedia`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const savedItem = await res.json();
          console.log("Save successful:", savedItem);
          setSaved(true);
          // Refresh the page to show the updated state
          window.location.reload();
        } else {
          const err = await res.text();
          console.error("Save failed", res.status, err);
        }
      } else {
        // Remove logic
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
          if (onRemove) onRemove();
          // Refresh the page to show the updated state
          window.location.reload();
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
