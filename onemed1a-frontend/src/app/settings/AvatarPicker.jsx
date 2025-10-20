"use client";

import { useRef, useState } from "react";

export default function AvatarPicker({ currentUrl }) {
  const [preview, setPreview] = useState(currentUrl || "");
  const inputRef = useRef(null);
  const formRef = useRef(null);

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
      <h2 className="text-base font-medium mb-4">Profile picture</h2>

      <div className="flex items-start gap-4">
        <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* Show preview if available, else placeholder */}
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-2xl font-semibold text-slate-700">
              {initials(name)}
            </div>
          )}
        </div>

        <form
          ref={formRef}
          action="/settings?avatar-upload" // progressive enhancement only; real submit is the button below
          className="space-y-3"
          encType="multipart/form-data"
        >
          <input
            ref={inputRef}
            type="file"
            name="avatar"
            accept="image/*"
            onChange={onFileChange}
            className="block text-sm"
          />

          <div className="flex gap-2">
            <button
              formAction={async (fd) => {
                // This formAction is ignored on server; it just exists to satisfy Next types
              }}
              // TODO: This button will be replaced by the server-action button
              type="button"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              onClick={() => inputRef.current?.click()}
            >
              Choose file
            </button>

            {/* The actual server-action submit button will be placed next to this in the page */}
          </div>
        </form>
      </div>
    </div>
  );
}
