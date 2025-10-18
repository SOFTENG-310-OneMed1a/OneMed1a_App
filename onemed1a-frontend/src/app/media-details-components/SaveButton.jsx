"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export default function SaveButton({ userId, mediaId }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        userId,
        mediaId,
        status: "PLAN_TO_WATCH", // TO DO: make this dynamic
      };

      console.log("Sending payload:", payload);

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
      onClick={handleSave}
      disabled={saving || saved}
      className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:opacity-90"
    >
      {saved ? "Saved!" : saving ? "Saving..." : "Save to My Movies"}
    </button>
  );
}
