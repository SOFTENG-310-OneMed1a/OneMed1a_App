"use client";

import { useState, useRef, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export default function SaveButton({ userId, mediaId, mediaType = "movie" }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const buttonRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState("auto");

  // Precompute the longest text for consistent width
  const longestText = `Save to My ${
    mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
  }`;

  useEffect(() => {
    if (buttonRef.current) {
      // Temporarily set the button text to the longest text
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.className = buttonRef.current.className;
      tempSpan.innerText = longestText;
      document.body.appendChild(tempSpan);

      const width = tempSpan.offsetWidth + 32; // Add padding buffer
      setButtonWidth(width);

      document.body.removeChild(tempSpan);
    }
  }, [longestText]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        userId,
        mediaId,
        type: mediaType.toUpperCase(),
        status: "PLAN_TO_WATCH",
      };

      console.log("Saving payload:", payload);

      const res = await fetch(`${API_BASE}/api/v1/usermedia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
      } else {
        const err = await res.text();
        console.error("Save failed", res.status, err);
      }
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleSave}
      disabled={saving || saved}
      style={{ width: buttonWidth }}
      className="rounded-xl bg-[#F13738] text-white px-4 py-2 hover:opacity-90 mt-4"
    >
      {saved
        ? "Saved!"
        : saving
        ? "Saving..."
        : `Save to My ${
            mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
          }`}
    </button>
  );
}
